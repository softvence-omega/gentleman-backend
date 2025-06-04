import { Controller, Get, Param, Req, Res } from '@nestjs/common';

@Controller('message')
export class MessageController {

    @Get('/:receiverId')
    async getAllMessage(@Req() req, @Res() res, @Param('receiverId') receiverId) {

    }

}
