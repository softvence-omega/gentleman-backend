import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Review extends AbstractionEntity {

  

  @Column('text')
  comment: string;

  @Column('float')
  rating: number;

 constructor(entity?: Partial<Review>) {
    super();
    Object.assign(this, entity);
  }
}
