import { applyDecorators } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiSecurity,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTaskDTO } from 'src/modules/tasks/dto/create-task.dto';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';

export function SwaggerDecoratorsByCreateTask(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Create task' }),
        ApiUnauthorizedResponse({ description: 'JWT is broken or expired' }),
        ApiOkResponse({
            description: 'Task has been created',
            type: TaskEntity,
        }),
        ApiBody({ description: 'Generic task  object', type: CreateTaskDTO }),
        ApiSecurity('bearer'),
    );
}
