import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
    @IsOptional()
    @IsEnum(TaskStatus)
    @ApiProperty({ default: TaskStatus.OPEN })
    status?: TaskStatus;
}
