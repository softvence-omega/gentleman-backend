import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Public } from 'src/utils/public.decorator';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post("login")
    async login(@Body() payload: LoginDto): Promise<any>{
        console.dir(payload);
    }


    @Public()
    @Post("register")
    async register(@Body() payload): Promise<any>{

    }

    @Public()
    @Post("forget-password")
    async forgetPassword(@Body() payload): Promise<any>{

    }

    @Public()
    @Post("reset-password")
    async resetPassword(@Body() payload):Promise<any>{

    }

    @Post("change-password")
    async changePassword(@Body() payload): Promise<any>{

    }
}
