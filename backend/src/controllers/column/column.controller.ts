import { Controller } from '@nestjs/common';
import { getBaseController } from '../base/base.controller';
import { ColumnDTO, CreateColumnDTO, UpdateColumnDTO } from '../../shared/dto/column.dto';
import { BlColumnService } from '../../business-logic/bl-column/bl-column.service';

@Controller('api/column')
export class ColumnController extends getBaseController({
  update: UpdateColumnDTO,
  create: CreateColumnDTO,
  response: ColumnDTO,
}) {
  constructor(columnService: BlColumnService) {
    super(columnService);
  }
}
