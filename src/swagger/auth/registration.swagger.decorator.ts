import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
} from '@nestjs/swagger';

import { RegistrationResponseDTO } from '../../modules/auth/dto/registartion-response.dto';
import { UserRegistrationDTO } from '../../modules/auth/dto/user-registration.dto';

export function SwaggerDecoratorsByRegistration(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Register a new user' }),
        ApiBadRequestResponse({ description: 'Invalid request' }),
        ApiBody({ type: UserRegistrationDTO }),
        ApiCreatedResponse({
            description: 'User registered successfully',
            type: RegistrationResponseDTO,
        }),
        ApiBadRequestResponse({ description: 'Invalid request' }),
    );
}
