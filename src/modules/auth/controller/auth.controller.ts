import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Public } from 'src/common/utils/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post("login")
    async login(@Body() payload: LoginDto, @Res() res: Response): Promise<any>{
        const result = await this.authService.login(payload);
        sendResponse(res, {
            statusCode: HttpStatus.OK,
            success: true,
            message: "User logged in successfully!",
            data: result
        })
    }


    @Public()
    @Post("register")
    async register(@Body() payload: CreateUserDto, @Res() res: Response): Promise<any>{
        const result = await this.authService.register(payload);
        sendResponse(res, {
            statusCode: HttpStatus.ACCEPTED,
            success: true,
            message: "User created successfully!",
            data: result
        })
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
