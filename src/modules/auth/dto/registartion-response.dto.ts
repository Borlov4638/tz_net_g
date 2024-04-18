import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    email: string;
}
