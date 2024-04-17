import { Entity } from 'typeorm';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../../modules/users/entities/user.entity';

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;
    @Column('character varying')
    title: string;
    @Column('character varying')
    description: string;
    //TODO: оставил boolean : enum
    @Column('boolean')
    status: boolean;
    @Column('uuid')
    author: string;
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'author' })
    user: UserEntity;
}
