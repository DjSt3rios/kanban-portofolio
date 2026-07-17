import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export interface IToken {
  token: string;
}

export class TokenDTO implements IToken {
  @ApiProperty({ readOnly: true })
  @IsString()
  token: string;
}