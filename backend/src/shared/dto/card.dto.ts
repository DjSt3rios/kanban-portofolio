import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface ICard {
  id: number;
  columnId: number;
  title: string;
  description: string;
  position: number;
}

export class CardDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  columnId: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty()
  position: number;
}

export class UpdateCardDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  columnId: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class CreateCardDTO {
  @ApiProperty()
  @IsNumber()
  columnId: number;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}
