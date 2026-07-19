import { Controller } from '@nestjs/common';
import { getBaseController } from '../base/base.controller';
import { ColumnService } from '../../persistence/column/column.service';
import { ColumnDTO, CreateColumnDTO, UpdateColumnDTO } from '../../shared/dto/column.dto';

@Controller('api/column')
export class ColumnController extends getBaseController({
  update: UpdateColumnDTO,
  create: CreateColumnDTO,
  response: ColumnDTO,
}) {
  constructor(columnService: ColumnService) {
    super(columnService);
  }
}
