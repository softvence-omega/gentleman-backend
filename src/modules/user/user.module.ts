import { Module } from '@nestjs/common';
import { ControllerController } from './controller/controller.controller';
import { ServiceService } from './service/service.service';
import { PrismaModule } from 'src/prisma/ prisma.module';

@Module({
  controllers: [ControllerController],
  providers: [ServiceService],
  imports: [PrismaModule],
})
export class UserModule {}
