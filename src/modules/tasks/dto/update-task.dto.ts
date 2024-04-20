import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;

    @ApiProperty({ required: false })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}
