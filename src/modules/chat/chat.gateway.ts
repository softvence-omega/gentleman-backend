import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Events } from './constants';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  private server: Server;
  constructor(private redisService: RedisService, private jwtService: JwtService) { }

  async handleConnection(client: Socket) {
    const redis = this.redisService.getClient();
    const userId = this.extractUserId(client);
    if (!userId) {
      client.emit(Events.FORBIDDEN, "Authorization token not found!");
      client.disconnect();
      return;
    }
    await redis.set(`user_socket:${userId}`, client.id);
    console.log(userId);
  }

  async handleDisconnect(client: Socket) {
    const redis = this.redisService.getClient();
    const userId = (client as any).userId;
    if (userId) {
      const socketId = await redis.get(`user_socket:${userId}`);
      if (socketId === client.id) {
        await redis.del(`user_socket:${userId}`);
      }
    }
  }

  @SubscribeMessage('send_message')
  async sendMessageToUser(client: Socket, payload: any) {
    try {
      payload = JSON.parse(payload);
      const redis = this.redisService.getClient();
      const socketId = await redis.get(`user_socket:${payload.receiverId}`);
      console.log(payload.receiverId);
      if (socketId) {
        console.log(socketId);
        this.server.to(socketId).emit('receive_message', payload.message);
      }
    } catch (e) {
      client.emit("failed_to_send", e.message);
    }

  }

  private extractUserId(client: Socket): string | null {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization;
      if (!token) return null;
      const decoded: any = this.jwtService.verify(token);
      return decoded.userId;
    } catch (err) {
      console.error('Invalid or missing token:', err.message);
      return null;
    }
  }
}
