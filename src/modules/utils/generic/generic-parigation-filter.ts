import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class GenericFilter {
    @ApiProperty({ required: false, default: 1 })
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: ' "page" atrribute should be a number' })
    @IsPositive()
    @IsOptional()
    public page?: number;

    @ApiProperty({ required: false, default: 10 })
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
    @IsPositive()
    @IsOptional()
    public pageSize?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    public sortBy?: string;

    @ApiProperty({ required: false, default: SortOrder.ASC })
    @IsEnum(SortOrder)
    @IsOptional()
    public sortOrder?: SortOrder = SortOrder.DESC;
}
