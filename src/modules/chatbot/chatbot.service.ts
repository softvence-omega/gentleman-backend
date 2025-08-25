import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ChatbotLog } from './entities/chatbot-log.entity';
import { User } from '../user/entities/user.entity';
import ApiError from 'src/common/errors/ApiError';
import { ChatBotMessageDto } from './dto/chat-message.dto';
import { UserRole } from '../user/dto/create-user.dto';

@Injectable()
export class ChatbotService {
    private openai: OpenAI;

    constructor(
        private configService: ConfigService,
        @InjectRepository(ChatbotLog)
        private chatRepo: Repository<ChatbotLog>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('openai_ai_api_key'),
        });
    }

    async askQuestion(user, payload: ChatBotMessageDto) {
        const userData = await this.userRepo.findOneBy({ id: user.userId });
        console.log("Fetching conversations for user:", user);

        if (!userData) {
            throw new ApiError(HttpStatus.FORBIDDEN, "user not found!");
        }
        const sid = payload.sessionId || uuidv4();

        const providers = await this.userRepo.find({
            where: { role: UserRole.PROVIDER }
        });
        // System prompt with rules
        const systemPrompt = `
        You are an assistant for a car service booking platform. 
        You must ONLY recommend one service provider from the list below based on the customer's needs.
        Be polite, concise, and professional.

        Provider List:
        ${providers.map(p => `- ${p.workShopName}, Location: ${p.latitude}, ${p.longitude}, Specialties: ${p.specialist}`).join("\n")}
        If you don't have enough info, ask a follow-up question before making a recommendation.
        `;

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: payload.question }
            ],
        });
        const answer = completion.choices[0].message.content;

        const log = this.chatRepo.create({
            user: userData,
            sessionId: sid,
            question: payload.question,
            answer,
        });
        await this.chatRepo.save(log);

        return { sessionId: sid, question: payload.question, answer };
    }

    async getAllConversations(user) {

        console.log("Fetching conversations for user:", user);
        // Ensure user exists
        const userData = await this.userRepo.findOneBy({ id: user.userId });
        if (!userData) {
            throw new ApiError(HttpStatus.FORBIDDEN, "User not found!");
        }

        // Fetch messages
        const messages = await this.chatRepo.find({
            where: { user: { id: user.userId } },
            order: { createdAt: 'ASC' },
            select: ['id', 'sessionId', 'question', 'answer', 'createdAt']
        });

        if (!messages.length) {
            throw new ApiError(HttpStatus.NOT_FOUND, "You don't have any conversation, write your message!");
        }

        return messages;
    }

}
