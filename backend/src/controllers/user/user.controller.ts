import { Controller, Get } from '@nestjs/common';
import { UserService } from '../../persistence/user/user.service';
import type { IUser } from '../../shared/dto/user.dto';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../shared/dto/user.dto';
import { getBaseController } from '../base/base.controller';
import { User } from '../../user.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/user')
export class UserController extends getBaseController({
  update: UpdateUserDTO,
  create: CreateUserDTO,
  response: UserDTO,
}) {
  constructor(userService: UserService) {
    super(userService);
  }

  @ApiResponse({ type: UserDTO, status: 200 })
  @Get('me')
  getUserInfo(@User() user: IUser) {
    return user;
  }
}
