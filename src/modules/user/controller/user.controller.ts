import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
     @Body() dto:CreateUserDto
  ) {
    return this.userService.createUser(dto);
  }
}
