import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtHelperModule } from 'src/common/jwt/jwt.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
    imports: [JwtHelperModule, RedisModule],
    providers: [ChatGateway],
    exports: [ChatGateway]
})
export class ChatModule { }
