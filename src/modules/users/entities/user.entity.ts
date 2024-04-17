import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { TaskEntity } from '../../../modules/tasks/entities/task.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('character varying', { unique: true })
    email: string;
    @Column('character varying')
    username: string;
    @Column('character varying')
    password: string;
    @CreateDateColumn()
    createdAt: string;
    @OneToMany(() => TaskEntity, (task) => task.user)
    articles: TaskEntity[];
}
