import { Module } from '@nestjs/common';
import { BlColumnModule } from './bl-column/bl-column.module';
import { BlCardModule } from './bl-card/bl-card.module';

@Module({
  imports: [BlColumnModule, BlCardModule],
})
export class BlModule {}
