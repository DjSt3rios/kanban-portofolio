import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface IUser {
  id: number;
  username: string;
  password: string;
}

export class UserDTO implements IUser {
  @IsNumber()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}