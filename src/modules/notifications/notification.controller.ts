import { BadRequestException, Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SendNotificationDto } from './dto/sendNotification.dto';
import { AuthenticatedRequest } from './types/AuthenticatedRequest';
import { CursorDto } from './dto/cursor.dto';
import { Public } from 'src/common/utils/public.decorator';
import { EventTypeService } from './event/event.service';



@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
     private readonly eventEmitter: EventTypeService
) {}
  @Public()
  @Post('send')
  async sendNotification(@Body() data: SendNotificationDto) {
   await this.eventEmitter.emit('NOTIFICATION_SEND', {
     fcmToken: data.token,
     title: data.title,
     body: data.body,
     data: data.data,
     userId: data.id
   });
  const test= await this.notificationService.sendPushNotification(data);
  
   return { success: true, message: 'Notification sent successfully' };
  }

  @Post('get')
@Public()
@ApiBearerAuth()
async getNotification(
  @Req() req: AuthenticatedRequest,
  @Body() body:{id:string},
) {
  const { id } = body;

  if (!id) {
    throw new BadRequestException('User ID not provided in body.');
  }

  return this.notificationService.getNotification({ id });
}
}