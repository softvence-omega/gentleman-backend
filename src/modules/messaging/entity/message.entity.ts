import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from 'src/modules/user/entities/user.entity';

export enum MessageType {
  IMAGE = 'image',
  PDF = 'pdf',
  TEXT = 'text',
}


@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

    @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  document: MessageType;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  conversationId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  receiver: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}