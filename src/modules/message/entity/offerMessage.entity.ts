import { AbstractionEntity } from "src/database/abstraction.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Message from "./message.entity";


export enum OfferMessegeStatus {
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

    @Column({ type: 'enum', enum: OfferMessegeStatus, default: OfferMessegeStatus.PENDING })
    status: OfferMessegeStatus

    @OneToOne(() => Message, message => message.offerMessage, { onDelete: 'CASCADE' })
    message: Message

}