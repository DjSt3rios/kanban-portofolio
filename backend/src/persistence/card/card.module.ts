import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity])],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
