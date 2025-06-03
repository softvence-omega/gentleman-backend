// cloudinary.provider.ts
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('cloudinary_cloud_name'),
            api_key: this.configService.get<string>('cloudinary_api_key'),
            api_secret: this.configService.get<string>('cloudinary_api_secret'),
        });
    }

    async uploadImage(buffer: Buffer, folder = 'nest_uploads'): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                },
            );
            Readable.from(buffer).pipe(uploadStream);
        });
    }
}
