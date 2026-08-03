import { Module } from '@nestjs/common';
import { BlColumnService } from './bl-column.service';
import { ColumnModule } from '../../persistence/column/column.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from '../../persistence/column/column.entity';
import { BoardGatewayModule } from '../../controllers/board/board-gateway.module';
import { AlsModule } from '../../als/als.module';

@Module({
  imports: [ColumnModule, TypeOrmModule.forFeature([ColumnEntity]), BoardGatewayModule, AlsModule],
  providers: [BlColumnService],
  exports: [BlColumnService],
})
export class BlColumnModule {}
