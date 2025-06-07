// cloudinary.provider.ts
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, DeleteApiResponse } from 'cloudinary';
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

    // Upload an image from a buffer
    async uploadImage(buffer: Buffer, folder = 'nest_uploads'): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder, resource_type: 'raw' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as UploadApiResponse);
                },
            );
            Readable.from(buffer).pipe(uploadStream);
        });
    }

    // Delete image by public_id
    async destroyImage(publicId: string): Promise<DeleteApiResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result as DeleteApiResponse);
            });
        });
    }

    // Optional: Extract public_id from secure_url
    extractPublicId(secureUrl: string): string | null {
        const matches = secureUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
        return matches ? matches[1] : null;
    }
}
