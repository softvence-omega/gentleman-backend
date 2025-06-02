import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async login(): Promise<any>{
        return await "login successfull!";
    }
}
