import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entity/message.entity';
import { Repository } from 'typeorm';
import ApiError from 'src/common/errors/ApiError';

@Injectable()
export class MessageService {

    constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) { }

    async getAllPrivateMessages(user, receiver_id, paginationDto) {
        const { page = 1, limit = 20 } = paginationDto;

        const [messages, total] = await this.messageRepository.findAndCount({
            where: [
                { sender: { id: user.userId }, receiver: { id: receiver_id } },
                { sender: { id: receiver_id }, receiver: { id: user.userId } },
            ],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['sender', 'receiver'],
        });
        if (messages.length === 0) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'No messages found!');
        }

        return {
            messages,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

}
