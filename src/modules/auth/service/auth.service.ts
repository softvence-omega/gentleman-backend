import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ApiError from 'src/common/errors/ApiError';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/modules/user/dto/create-user.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { ChangePasswordDto } from '../dto/changePassword.dto';
import { EmailService } from 'src/common/nodemailer/email.service';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { ResetPasswordDto } from '../dto/resetPassword.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private config: ConfigService,
        private jwtService: JwtService,
        private cloudinary: CloudinaryService,
        private emailService: EmailService
    ) { }

    async login(payload: LoginDto): Promise<any> {
        const { email, password } = payload
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new ApiError(HttpStatus.NOT_FOUND, "User not found!");
        }

        if (user.status === "blocked") {
            throw new ApiError(HttpStatus.FORBIDDEN, "User is unauthorized!");
        }

        if (user.isDeleted) {
            throw new ApiError(HttpStatus.FORBIDDEN, "User is deleted!");
        }

        const passwordVerify = await bcrypt.compare(password, user.password);

        if (!passwordVerify) {
            throw new ApiError(HttpStatus.FORBIDDEN, "Email or Password not matched!");
        }

        const jwtPayload = {
            userId: user.id,
            role: user.role
        }

        const accessToken = await this.jwtService.signAsync(jwtPayload, {
            expiresIn: this.config.get("jwt_expired_in")
        });

        return {
            accessToken,
            expires_in: this.config.get("jwt_expired_in"),
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                role: user.role
            }
        }

    }

    async register(payload: any, file?: Express.Multer.File): Promise<any> {
        const { email, password } = payload;

        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ApiError(HttpStatus.CONFLICT, "User already exist!");
        }

        const hashPassword = await bcrypt.hash(password, Number(this.config.get("bcrypt_salt_rounds")));

        let result;
        if (file) {
            try {
                result = await this.cloudinary.uploadFile(file);
            } catch (e) {
                throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
            }
        }

        const data = { ...payload, password: hashPassword, certificate: result ? result['secure_url'] : '' };
        const userEntity = this.userRepository.create(data);
        const savedUser = await this.userRepository.save(userEntity);

        return savedUser;
    }

    async forgetPassword(payload: ForgotPasswordDto): Promise<any> {
        const user = await this.userRepository.findOneBy({ email: payload.email });
        if (!user) {
            throw new ApiError(HttpStatus.NOT_FOUND, "This user is not found !");
        }

        const isDeleted = user?.isDeleted;
        if (isDeleted) {
            throw new ApiError(HttpStatus.FORBIDDEN, "This user is deleted !");
        }


        const userStatus = user?.status;
        if (userStatus === "blocked") {
            throw new ApiError(HttpStatus.FORBIDDEN, "This user is blocked ! !");
        }

        const jwtPayload = {
            userId: user.id,
            role: user.role,
        };

        const resetToken = await this.jwtService.signAsync(jwtPayload, {
            expiresIn: this.config.get('jwt_expired_in')
        });

        const otp = this.emailService.generateOtp();
        user.otp = otp;
        await this.userRepository.save(user);
        await this.emailService.sendEmail(user.email, "Reset password", `<p>Your password reset OTP: ${otp}</p>`);
        return {
            resetToken
        }
    }

    async changePassword(
        userData: any,
        payload: ChangePasswordDto
    ): Promise<void> {
        const user = await this.userRepository.findOneBy({ id: userData.userId });

        if (!user) {
            throw new ApiError(HttpStatus.NOT_FOUND, "User not found!");
        }

        if (user.isDeleted) {
            throw new ApiError(HttpStatus.FORBIDDEN, "User is deleted!");
        }

        if (user.status === "blocked") {
            throw new ApiError(HttpStatus.FORBIDDEN, "User is blocked!");
        }
        const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);
        if (!isPasswordMatched) {
            throw new ApiError(HttpStatus.FORBIDDEN, "Password did not match!");
        }

        const newHashedPassword = await bcrypt.hash(
            payload.password,
            Number(this.config.get('bcrypt_salt_rounds'))
        );

        user.password = newHashedPassword;
        await this.userRepository.save(user);

        return;
    }


    async resetPassword(payload: ResetPasswordDto): Promise<any> {
        if (await this.jwtService.verifyAsync(payload.resetToken)) {
            throw new ApiError(HttpStatus.FORBIDDEN, "Invalid or expired token!");
        }

        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) {
            throw new ApiError(HttpStatus.NOT_FOUND, "User not found!");
        }

        const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

        user.password = hashedPassword;
        await this.userRepository.save(user);

        return {
            message: "Password has been reset successfully",
        };
    }
}
