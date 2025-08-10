import { AbstractionEntity } from "src/database/abstraction.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("chatbot_logs")
export class ChatbotLog extends AbstractionEntity {
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    sessionId: string;

    @Column('text')
    question: string;

    @Column('text', { nullable: true })
    answer: string | null;
}