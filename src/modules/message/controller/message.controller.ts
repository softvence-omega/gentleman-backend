import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {

    constructor(private service: MessageService) { }

    @Get('/:receiverId')
    async getAllMessage(@Req() req, @Res() res, @Param('receiverId') receiverId) {
        const result = this.service.getAllPrivateMessages();
    }

}
