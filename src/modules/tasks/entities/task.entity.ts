import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../../modules/users/entities/user.entity';

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN PROGRES',
    DONE = 'DONE',
}

@Entity()
export class TaskEntity {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column('character varying')
    title: string;

    @ApiProperty()
    @Column('character varying')
    description: string;
    //TODO: оставил boolean : enum

    @ApiProperty()
    @Column('character varying', { default: TaskStatus.OPEN })
    status: TaskStatus;

    @ApiProperty()
    @Column('uuid')
    author: string;
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'author' })
    user: UserEntity;
}
