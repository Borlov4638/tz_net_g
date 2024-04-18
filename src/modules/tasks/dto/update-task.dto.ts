import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
