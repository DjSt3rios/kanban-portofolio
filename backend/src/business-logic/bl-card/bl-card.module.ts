import { Module } from '@nestjs/common';
import { BlCardService } from './bl-card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../../persistence/card/card.entity';
import { CardModule } from '../../persistence/card/card.module';
import { BoardGatewayModule } from '../../controllers/board/board-gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity]), CardModule, BoardGatewayModule],
  providers: [BlCardService],
  exports: [BlCardService],
})
export class BlCardModule {}
