import { ApiProperty } from '@nestjs/swagger';
import { GenericPaginationViewModel } from 'src/modules/utils/generic/generic-pagintion.view-model';

import { TaskEntity } from '../entities/task.entity';

export class AllTasksViewModel extends GenericPaginationViewModel {
    @ApiProperty({ isArray: true, type: TaskEntity })
    data: TaskEntity[];
}
