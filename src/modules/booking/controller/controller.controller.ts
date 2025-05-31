import { Controller, Get } from '@nestjs/common';

@Controller('booking')
export class ControllerController {
    @Get()
    getHello(): string {
    return 'Hello booking!';
  }
}
