import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendNotificationDto } from '../dto/sendNotification.dto';
import { CursorDto } from '../dto/cursor.dto';
import { ApiResponse } from '../types/apiResponse';
import { Notification } from '../entity/notificationcs.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async sendPushNotification({
  token,
  title,
  body,
  data,
  bookingId,
  id,
}: SendNotificationDto) {
 try {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: {
      ...(data || {}),
      ...(bookingId ? { bookingId } : {}),
    },
  };

  const response = await this.firebaseService.getMessaging().send(message);
  this.logger.debug(`Push notification sent: ${response}`);

  const saved = await this.notificationRepository.save({
    user:{id},
    title,
    body,
    bookingId,
    data,
  });

  this.logger.debug('Saved notification:', saved);
} catch (error) {
  this.logger.error('Error sending push notification or saving it:', error);
}

}


public async getNotification(
  { id }: { id: string }
): Promise<ApiResponse<Notification[]>> {
  const data = await this.notificationRepository.find({
    where: { userId: id },
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    message: 'Notifications fetched successfully',
    success: true,
  };
}

}
