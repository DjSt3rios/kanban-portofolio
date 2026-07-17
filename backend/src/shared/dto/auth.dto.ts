import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export interface IAuthentication {
  username: string;
  password: string;
}

export class AuthenticationDTO implements IAuthentication {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  password: string;
}