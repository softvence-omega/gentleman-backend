import { AbstractionEntity } from 'src/database/abstraction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    JoinTable
} from 'typeorm';
import { OfferMessege } from './offerMessage.entity';

export enum MessageType {
    TEXT = 'text',
    FILE = 'file',
    OFFER = 'offer'
}

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
}

@Entity('messages')
class Message extends AbstractionEntity {
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    @Column({ type: 'enum', enum: MessageType })
    type: MessageType;

    @Column({ type: 'text', nullable: true })
    content: string | null;

    @Column({ type: 'varchar', nullable: true, array: true })
    fileNames: string[] | null;

    @Column({ type: 'varchar', nullable: true, array: true })
    fileUrls: string[] | null;

    @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;

    @Column({ type: 'timestamp', name: 'seen_at', nullable: true })
    seenAt: Date | null;

    @OneToOne(() => OfferMessege, offerMessage => offerMessage.message, { eager: true })
    @JoinColumn()
    offerMessage: OfferMessege
}

export default Message;