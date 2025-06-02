import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import ApiError from 'src/common/errors/ApiError';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>, private config: ConfigService, private jwtService: JwtService ) {}

    async login(payload: LoginDto): Promise<any>{
        const {email, password} = payload
        const user = await this.userRepository.findOneBy({email});

        if(!user){
            throw new ApiError(HttpStatus.NOT_FOUND, "User not found!");
        }

        if(user.status === "blocked"){
            throw new ApiError(HttpStatus.FORBIDDEN, "User is unauthorized!");
        }

        if(user.isDeleted){
            throw new ApiError(HttpStatus.FORBIDDEN, "User is deleted!");
        }

        const passwordVerify = await bcrypt.compare(password, user.password);
        
        if(!passwordVerify){
            throw new ApiError(HttpStatus.FORBIDDEN, "Email or Password not matched!");
        }

        const jwtPayload = {
            userId: user.id,
            role: user.role
        }

        const accessToken = await this.jwtService.signAsync(jwtPayload, {
            expiresIn: this.config.get("jwt_expired_in") || '5m'
        });

        return {
            accessToken
        }

    }

    async register(payload: CreateUserDto): Promise<any>{
        const {email, password} = payload;

        const existingUser = await this.userRepository.findOneBy({email});
        console.log(existingUser);
        if(existingUser){
            throw new ApiError(HttpStatus.CONFLICT, "User already exist!");
        }

        const hashPassword = await bcrypt.hash(password, Number(this.config.get("bcrypt_salt_rounds")));

        const data = {...payload, password: hashPassword};
        const userEntity = this.userRepository.create(data);
        const savedUser = await this.userRepository.save(userEntity);

        return savedUser;
    }

    async forgetPassword(): Promise<any>{

    }

    async changePassword(): Promise<any>{

    }

    async resetPassword(): Promise<any>{

    }
}
