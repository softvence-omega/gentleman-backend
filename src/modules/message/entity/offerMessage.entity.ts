import { AbstractionEntity } from "src/database/abstraction.entity";
import { Column, Entity } from "typeorm";


enum Status {
    ACCEPTED = 'accepted',
    CANCELED = 'canceled',
    REJECTED = 'rejected',
    PENDING = 'pending'
}


@Entity('offer_messages')
class OfferMessege extends AbstractionEntity {
    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'bigint' })
    offerPrice: number;

    @Column({ type: 'enum', enum: Status, default: Status.PENDING })
    status: Status
}