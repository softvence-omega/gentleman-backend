import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Public } from 'src/utils/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post("login")
    async login(): Promise<any>{
        const result = await this.authService.login();
        return result;
    }
}
