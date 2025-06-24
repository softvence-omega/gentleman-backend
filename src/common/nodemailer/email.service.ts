import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly configService: ConfigService) {
        const user = this.configService.get<string>('smtp_auth_user');
        const pass = this.configService.get<string>('smtp_auth_pass');

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user,
                pass,
            },
        });

        // Optional: Verify SMTP configuration
        this.transporter.verify((error, success) => {
            if (error) {
                this.logger.error('Error configuring SMTP transporter', error);
            } else {
                this.logger.log('SMTP transporter is ready to send emails');
            }
        });
    }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"Support Team" <${this.configService.get<string>('smtp_auth_user')}>`,
                to,
                subject,
                text: 'Reset password within 5 minutes!',
                html,
            });
            this.logger.log(`Email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
            throw new Error('Failed to send email');
        }
    }

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    }
}
