import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
} from '@nestjs/swagger';

import { RegistrationViewModel } from '../../modules/auth/dto/registartion.view-model.dto';
import { UserRegistrationDTO } from '../../modules/auth/dto/user-registration.dto';

export function SwaggerDecoratorsByRegistration(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Register a new user' }),
        ApiBadRequestResponse({ description: 'Invalid request' }),
        ApiBody({ type: UserRegistrationDTO }),
        ApiCreatedResponse({
            description: 'User registered successfully',
            type: RegistrationViewModel,
        }),
        ApiBadRequestResponse({ description: 'Invalid request' }),
    );
}
