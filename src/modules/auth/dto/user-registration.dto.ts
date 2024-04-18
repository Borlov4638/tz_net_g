import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegistrationDTO {
    @ApiProperty()
    @IsString()
    @Length(3, 10)
    username: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @Length(6, 20)
    password: string;
}
