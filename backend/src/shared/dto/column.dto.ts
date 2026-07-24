import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CardEntity } from '../../persistence/card/card.entity';
import { CardDTO } from './card.dto';

export interface IColumn {
  id: number;
  title: string;
  position: number;
  cards: CardEntity[];
}

export class ColumnDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  position: number;

  @ApiProperty({ type: CardDTO, isArray: true })
  cards: CardDTO[];
}

export class UpdateColumnDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class CreateColumnDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}
