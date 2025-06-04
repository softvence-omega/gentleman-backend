import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  private server: Server;
  constructor(private redisService: RedisService, private jwtService: JwtService) { }

  async handleConnection(client: Socket) {
    console.log(client.id);
    const redis = this.redisService.getClient();
    const userId = this.extractUserId(client);
    if (userId) {
      await redis.set(`user_socket:${userId}`, client.id);
    }
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
  async sendMessageToUser(userId: string, message: any) {
    const redis = this.redisService.getClient();
    const socketId = await redis.get(`user_socket:${userId}`);
    if (socketId) {
      this.server.to(socketId).emit('receive_message', message);
    }
  }

  private extractUserId(client: Socket): string | null {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization;

      if (!token) return null;

      const cleanedToken = token.replace('Bearer ', '');
      const decoded: any = this.jwtService.verify(cleanedToken);
      return decoded.userId;
    } catch (err) {
      console.error('Invalid or missing token:', err.message);
      return null;
    }
  }
}
