import { Controller } from '@nestjs/common';
import { UserService } from '../../persistence/user/user.service';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../shared/dto/user.dto';
import { getBaseController } from '../base/base.controller';

@Controller('api/user')
export class UserController extends getBaseController({
  update: UpdateUserDTO,
  create: CreateUserDTO,
  response: UserDTO,
}) {
  constructor(userService: UserService) {
    super(userService);
  }
}
