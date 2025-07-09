





// offer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Conversation } from './conversation.entity';
import { User } from 'src/modules/user/entities/user.entity';


export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  conversationId: string;

  @Column()
  message: string;

  @Column('float')
  price: number;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.sentOffers)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedOffers)
  receiver: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.offers)
  conversation: Conversation;
}
