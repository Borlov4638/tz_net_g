import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AllTasksViewModel } from '../../modules/tasks/services/task.service';

export function SwaggerDecoratorsByGetAllTasks(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Get task by id' }),
        ApiOkResponse({
            description: 'Returns tasks with pagination',
            type: AllTasksViewModel,
        }),
    );
}
