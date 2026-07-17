import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface IUser {
  id: number;
  username: string;
  password: string;
}

export class UserDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;
}

export class CreateUserDTO {
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