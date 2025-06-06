import { AbstractionEntity } from "src/database/abstraction.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Message } from "./message.entity";


enum Status {
    ACCEPTED = 'accepted',
    CANCELED = 'canceled',
    REJECTED = 'rejected',
    PENDING = 'pending'
}


@Entity('offer_messages')
export class OfferMessege extends AbstractionEntity {
    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'bigint' })
    offerPrice: number;

    @Column({ type: 'enum', enum: Status, default: Status.PENDING })
    status: Status

    @OneToOne(() => Message, message => message.offerMessage, { lazy: true, onDelete: 'CASCADE' })
    message: Promise<Message>

}