import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
    async login(payload: LoginDto): Promise<any>{
        return console.dir(payload);
    }

    async register(): Promise<any>{

    }

    async forgetPassword(): Promise<any>{

    }

    async changePassword(): Promise<any>{

    }

    async resetPassword(): Promise<any>{

    }
}
