import { IsEmail, IsString, Length } from 'class-validator';

export class UserRegistrationDTO {
    @IsString()
    @Length(3, 10)
    username: string;
    @IsEmail()
    email: string;
    @IsString()
    @Length(6, 20)
    password: string;
}
