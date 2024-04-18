import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../../modules/users/entities/user.entity';

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
    @Column('boolean', { default: false })
    status: boolean;

    @ApiProperty()
    @Column('uuid')
    author: string;
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'author' })
    user: UserEntity;
    //TODO:  сделать дату создания задачи и ее редактирования
}
