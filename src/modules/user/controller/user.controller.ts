import {
  Controller,
  Body,
  Req,
  Res,
  Patch,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import sendResponse from 'src/common/utils/sendResponse';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'certificate', maxCount: 1 },
    ])
  )
  async updateUser(
    @Req() req,
    @Body() payload: UpdateUserDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      certificate?: Express.Multer.File[];
    },
    @Res() res,
  ) {
    const image = files.image?.[0];
    const certificate = files.certificate?.[0];

    const result = await this.userService.updateUser(req.user, payload, image, certificate);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User updated successfully!",
      data: result
    })
  }

@Get('/provider/locations')
async getProviderLocations() {
  const data = await this.userService.getProviderLocations();
  return {
    message: 'Provider locations fetched successfully',
    data,
  };
}

}
