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
  } catch (error) {
    this.logger.error(`Error sending push notification: ${error}`);
  }
}


  public async getNotification(
    { id }: { id: string },
    { cursor, take }: CursorDto,
  ): Promise<ApiResponse<Notification[]>> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :id', { id })
      .orderBy('notification.createdAt', 'DESC')
      .take(take);

    if (cursor) {
      // For cursor pagination, we assume cursor is notification id and paginate by createdAt + id
      const cursorNotification = await this.notificationRepository.findOneBy({ id: cursor });
      if (cursorNotification) {
        query.andWhere(
          '(notification.createdAt < :createdAt OR (notification.createdAt = :createdAt AND notification.id < :id))',
          {
            createdAt: cursorNotification.createdAt,
            id: cursorNotification.id,
          },
        );
      }
    }

    const data = await query.getMany();

    return {
      data,
      message: 'Notifications fetched successfully',
      success: true,
    };
  }
}
