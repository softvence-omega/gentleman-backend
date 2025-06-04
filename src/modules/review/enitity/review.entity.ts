import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Review extends AbstractionEntity {
  @Column('text')
  comment: string;

  @Column('float')
  rating: number;

  @ManyToOne(() => Booking, (booking) => booking.reviews, { onDelete: 'CASCADE' })
  booking: Booking;

  constructor(entity?: Partial<Review>) {
    super();
    Object.assign(this, entity);
  }
}
