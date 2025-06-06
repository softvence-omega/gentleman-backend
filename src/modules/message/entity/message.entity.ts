import { AbstractionEntity } from 'src/database/abstraction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';

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
export class Message extends AbstractionEntity {
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

    @Column({ type: 'varchar', nullable: true })
    fileName: string | null;

    @Column({ type: 'varchar', nullable: true })
    fileUrl: string | null;

    @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;

    @Column({ type: 'timestamp', name: 'seen_at', nullable: true })
    seenAt: Date | null;
}
