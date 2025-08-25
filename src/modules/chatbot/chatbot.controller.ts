import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatBotMessageDto } from './dto/chat-message.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @ApiSecurity("accessToken")
  
  @Post("ask-question")
  async askQuestion(@Req() req, @Res() res, @Body() payload: ChatBotMessageDto) {
    const result = await this.chatbotService.askQuestion(req.user, payload);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Response received successfully!",
      data: result
    })
  }

  @Get("previous-conversations")
  async getPreviousConversations(@Req() req, @Res() res) {
    const result = await this.chatbotService.getAllConversations(req.user);
    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "All messages are fetched!",
      data: result
    })
  }
}
