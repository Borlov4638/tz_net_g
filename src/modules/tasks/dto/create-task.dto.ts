import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ default: false })
    status?: boolean;
}
