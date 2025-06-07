import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { MessageService } from '../service/message.service';
import sendResponse from 'src/common/utils/sendResponse';
import { PaginationDto } from '../dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { CreateMessageDto } from '../dto/create-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Messages')
@Controller('message')
export class MessageController {
    constructor(private service: MessageService) { }

    @Get('/:receiverId')
    @ApiOperation({ summary: 'Get all private messages with a user' })
    @ApiParam({ name: 'receiverId', type: String, description: 'ID of the receiver' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Items per page' })
    async getAllMessage(
        @Req() req,
        @Res() res,
        @Param('receiverId') receiverId: string,
        @Query() paginationDto: PaginationDto
    ) {
        const result = await this.service.getAllPrivateMessages(
            req.user,
            receiverId,
            paginationDto
        );

        return sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'All Found Messages!',
            data: result,
        });
    }


    @ApiConsumes('multipart/form-data')
    @Post()
    @UseInterceptors(FilesInterceptor('attachments'))
    async createMessage(@Req() req, @Res() res, @Body() payload: CreateMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
        const result = await this.service.createMessage(req.user, payload);

        return sendResponse(res, {
            statusCode: HttpStatus.CREATED,
            success: true,
            message: "Message saved successfully!",
            data: result
        })
        console.log(req.user, payload, files);
    }
}
