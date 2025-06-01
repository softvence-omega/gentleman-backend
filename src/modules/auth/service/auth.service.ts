import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async login(): Promise<any>{
        return await "login successfull!";
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
