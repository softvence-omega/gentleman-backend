import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { Offer } from './offer.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user1Id: string;

  @Column()
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @ManyToOne(() => User, (user) => user.conversations1, { cascade: true })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversations2, { cascade: true })
  user2: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => Offer, (offer) => offer.conversation)
  offers: Offer[];
}