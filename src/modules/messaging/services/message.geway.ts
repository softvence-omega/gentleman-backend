// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer, OfferStatus } from '../entity/offer.entity';
import { RedisService } from './redis.services';
import { Message, MessageType } from '../entity/message.entity';
import { Conversation } from '../entity/conversation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import Booking from 'src/modules/booking/entity/booking.entity';


@WebSocketGateway({ cors: { origin: '*' } , })
@Injectable()
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Conversation) private convoRepo: Repository<Conversation>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Offer) private offerRepo: Repository<Offer>,
    private redisService: RedisService,
    @InjectRepository(Booking) private bookingRepo : Repository<Booking>
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Socket connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    
    const userSocketMap = await this.redisService.hGetAll('userSocketMap');
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === client.id,
    );

    if (userId) {
      await this.redisService.hDel('userSocketMap', userId);
      await this.redisService.hDel('userActiveChatMap', userId);
      console.log(`User ${userId} disconnected and removed`);
    }
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {

    await this.redisService.hSet('userSocketMap', data.userId, client.id);
    console.log(`User ${data.userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { text: string; sender: string; receiver: string, document:MessageType },
    @ConnectedSocket() client: Socket,
  ) {
    const { sender, receiver, text,document} = data;
    const [user1Id, user2Id] = [sender, receiver].sort();

    console.log("hit here")

    let conversation = await this.convoRepo.findOne({
      where: { user1Id, user2Id },
    });

    if (!conversation) {
      conversation = await this.convoRepo.save(this.convoRepo.create({
        user1Id,
        user2Id,
      }));

      const [senderUser, receiverUser] = await Promise.all([
        this.userRepo.findOne({ where: { id: sender } }),
        this.userRepo.findOne({ where: { id: receiver } }),
      ]);

      const newChatUserForReceiver = {
        id: senderUser?.id,
        name: senderUser?.name,
        hasGoogleAccount: true,
        unreadCount: 1,
      };

      const newChatUserForSender = {
        id: receiverUser?.id,
        name: receiverUser?.name,
        hasGoogleAccount: true,
        unreadCount: 0,
      };

      const [receiverSocketId, senderSocketId] = await Promise.all([
        this.redisService.hGet('userSocketMap', receiver),
        this.redisService.hGet('userSocketMap', sender),
      ]);

      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newConversation', newChatUserForReceiver);
      }

      if (senderSocketId) {
        this.server.to(senderSocketId).emit('newConversation', newChatUserForSender);
      }
    }

    const receiverActiveWith = await this.redisService.hGet(
      'userActiveChatMap',
      receiver,
    );

    

    const savedMessage = await this.messageRepo.save(this.messageRepo.create({
      text,
      document,
      senderId: sender,
      receiverId: receiver,
      conversationId: conversation.id,
      isRead: receiverActiveWith === sender,
    }));

    await this.convoRepo.update(conversation.id, {
      lastMessageAt: new Date(),
    });

    const receiverSocketId = await this.redisService.hGet(
      'userSocketMap',
      receiver,
    );

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newChatItem', {
        type: 'message',
        ...savedMessage,
      });

      if (receiverActiveWith !== sender) {
        const unreadCount = await this.messageRepo.count({
          where: {
            conversationId: conversation.id,
            receiverId: receiver,
            isRead: false,
          },
        });

        this.server.to(receiverSocketId).emit('unreadCountUpdate', {
          conversationId: conversation.id,
          count: unreadCount,
          from: sender,
        });
      }
    }

    client.emit('newChatItem', {
      type: 'message',
      ...savedMessage,
    });

    client.emit('sendSuccessfully', {
      type: 'message',
      ...savedMessage,
    });
  }

  @SubscribeMessage('loadMessages')
  async handleLoadMessages(
    @MessageBody() data: { userId1: string; userId2: string },
    @ConnectedSocket() client: Socket,
  ) {
    const [user1Id, user2Id] = [data.userId1, data.userId2].sort();
    const conversation = await this.convoRepo.findOne({ where: { user1Id, user2Id } });
    if (!conversation) {
      client.emit('conversationItems', []);
      return;
    }

    await this.messageRepo.update({
      conversationId: conversation.id,
      receiverId: user1Id,
      isRead: false,
    }, {
      isRead: true,
    });

    await this.redisService.hSet('userActiveChatMap', user1Id, user2Id);

    const [messages, offers] = await Promise.all([
      this.messageRepo.find({
        where: { conversationId: conversation.id },
        order: { createdAt: 'ASC' },
      }),
      this.offerRepo.find({
        where: { conversationId: conversation.id },
        order: { createdAt: 'ASC' },
      }),
    ]);

    const merged = [...messages.map((m) => ({
      type: 'message',
      ...m,
    })), ...offers.map((o) => ({
      type: 'offer',
      ...o,
    }))].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    this.server.to(client.id).emit('conversationItems', merged);
    this.server.to(client.id).emit('unreadCountUpdate', {
      conversationId: conversation.id,
      count: 0,
      from: user2Id,
    });
  }

  

  @SubscribeMessage('getConversations')
async handleGetConversations(
  @MessageBody() data: { userId: string },
  @ConnectedSocket() client: Socket,
) {
  const { userId } = data;

  const conversations = await this.convoRepo.find({
    where: [{ user1Id: userId }, { user2Id: userId }],
    order: { lastMessageAt: 'DESC' },
  });

  if (!conversations.length) {
    client.emit('conversationsLoaded', []);
    return;
  }

  // Extract the other user IDs from each conversation
  const userIds = conversations.map((c) =>
    c.user1Id === userId ? c.user2Id : c.user1Id,
  );

  const users = await this.userRepo.findByIds(userIds);

  // Get unread message counts grouped by sender
  const unreadCounts = await this.messageRepo
    .createQueryBuilder('m')
    .select('m.senderId', 'senderId')
    .addSelect('COUNT(*)', 'count')
    .where('m.receiverId = :userId AND m.isRead = false', { userId })
    .groupBy('m.senderId')
    .getRawMany();

  // Build conversation list enriched with name, profile, unread count, and last message time
  const chatUsers = conversations.map((convo) => {
    const otherUserId = convo.user1Id === userId ? convo.user2Id : convo.user1Id;
    const user = users.find((u) => u.id === otherUserId);
    const countObj = unreadCounts.find((x) => x.senderId === otherUserId);

    return {
      id: user?.id,
      name: user?.name,
      profile: user?.profileImage,
      unreadCount: Number(countObj?.count || 0),
      lastMessageAt: convo.lastMessageAt,
    };
  });

  client.emit('conversationsLoaded', chatUsers);
}


  @SubscribeMessage('createOffer')
  async handleCreateOffer(
    @MessageBody() data: {
      senderId: string;
      receiverId: string;
      message: string;
      price: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { senderId, receiverId, message, price } = data;
    const [user1Id, user2Id] = [senderId, receiverId].sort();

    let conversation = await this.convoRepo.findOne({ where: { user1Id, user2Id } });
    if (!conversation) {
      conversation = await this.convoRepo.save(
        this.convoRepo.create({ user1Id, user2Id })
      );
    }

    const offer = await this.offerRepo.save(
      this.offerRepo.create({
        senderId,
        receiverId,
        conversationId: conversation.id,
        message,
        price,
      })
    );

    const [receiverSocketId, senderSocketId] = await Promise.all([
      this.redisService.hGet('userSocketMap', receiverId),
      this.redisService.hGet('userSocketMap', senderId),
    ]);

    const payload = { type: 'offer', ...offer };

    if (receiverSocketId) this.server.to(receiverSocketId).emit('newChatItem', payload);
    if (senderSocketId) this.server.to(senderSocketId).emit('newChatItem', payload);
    client.emit('offerCreated', payload);
  }

  @SubscribeMessage('updateOffer')
  async handleUpdateOffer(
    @MessageBody() data: {
      offerId: string;
      userId: string;
      message?: string;
      price?: number;
      action?: 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    },
    @ConnectedSocket() client: Socket,
  ) {
    const offer = await this.offerRepo.findOne({ where: { id: data.offerId } });
    if (!offer) return;

    if ([OfferStatus.ACCEPTED, OfferStatus.REJECTED].includes(offer.status)) return;

    const isSender = offer.senderId === data.userId;
    const isReceiver = offer.receiverId === data.userId;

    if (data.action === 'CANCELLED' && !isSender) return;
    if (['ACCEPTED', 'REJECTED'].includes(data.action || '') && !isReceiver) return;
    if ((data.message || data.price !== undefined) && !isSender) return;

    const updatePayload: any = {};
    if (data.action) updatePayload.status = data.action;
    if (data.message) updatePayload.message = data.message;
    if (data.price !== undefined) updatePayload.price = data.price;

    const updatedOffer = await this.offerRepo.save({ ...offer, ...updatePayload });

    const [senderSocketId, receiverSocketId] = await Promise.all([
      this.redisService.hGet('userSocketMap', offer.senderId),
      this.redisService.hGet('userSocketMap', offer.receiverId),
    ]);

    const payload = { type: 'offer', ...updatedOffer };

    if (senderSocketId) this.server.to(senderSocketId).emit('newChatItem', payload);
    if (receiverSocketId) this.server.to(receiverSocketId).emit('newChatItem', payload);
  }

  @SubscribeMessage('getAllCustomers')
async handleGetAllCustomers(
  @ConnectedSocket() client: Socket,
) {
  const customers = await this.userRepo.find({
    where: { role: 'customer', isDeleted: false },
    select: ['id', 'name', 'email', 'status', 'role', 'profileImage'],
    order: { createdAt: 'DESC' },
  });

  client.emit('allCustomers', customers);
}

@SubscribeMessage('updateBookingLocation')
async handleUpdateBookingLocation(
  @MessageBody() data: { bookingId: string; latitude: string; longitude: string },
  @ConnectedSocket() client: Socket,
) {
  const { bookingId, latitude, longitude } = data;

  const booking = await this.bookingRepo.findOne({
    where: { id: bookingId },
    relations: ['provider'],
  });

  if (!booking) {
    return client.emit('bookingLocationUpdateError', {
      message: 'Booking not found',
    });
  }

  booking.latitude = latitude;
  booking.longitude = longitude;

  await this.bookingRepo.save(booking);

  const responsePayload = {
    bookingId,
    latitude,
    longitude,
    message: 'Booking location updated successfully',
  };

  // Emit to sender
  client.emit('bookingLocationUpdated', responsePayload);

  // Emit to provider
  const providerId = booking.provider?.id;
  if (providerId) {
    const providerSocketId = await this.redisService.hGet('userSocketMap', providerId);
    if (providerSocketId) {
      this.server.to(providerSocketId).emit('bookingLocationUpdated', responsePayload);
    }
  }
}







}

// Entity files (user.entity.ts, conversation.entity.ts, message.entity.ts, offer.entity.ts)
// will be provided next.

// @SubscribeMessage('getConversations')
//   async handleGetConversations(
//     @MessageBody() data: { userId: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { userId } = data;

//     const conversations = await this.convoRepo.find({
//       where: [{ user1Id: userId }, { user2Id: userId }],
//       order: { lastMessageAt: 'DESC' },
//     });

//     if (!conversations.length) {
//       client.emit('conversationsLoaded', []);
//       return;
//     }

//     const userIds = conversations.map((c) =>
//       c.user1Id === userId ? c.user2Id : c.user1Id
//     );

//     const users = await this.userRepo.findByIds(userIds);

//     const unreadCounts = await this.messageRepo
//       .createQueryBuilder('m')
//       .select('m.senderId', 'senderId')
//       .addSelect('COUNT(*)', 'count')
//       .where('m.receiverId = :userId AND m.isRead = false', { userId })
//       .groupBy('m.senderId')
//       .getRawMany();

//     const chatUsers = users.map((u) => {
//       const countObj = unreadCounts.find((x) => x.senderId === u.id);
//       return {
//         id: u.id,
//         name: u.name,
//         profile: u?.profileImage,
//         unreadCount: Number(countObj?.count || 0),
//       };
//     });

//     client.emit('conversationsLoaded', chatUsers);
//   }
