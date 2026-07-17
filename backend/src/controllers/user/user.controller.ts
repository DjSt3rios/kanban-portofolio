import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from '../../persistence/user/user.service';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../shared/dto/user.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { User } from '../../user.decorator';
import { UserEntity } from '../../persistence/user/user.entity';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @ApiOkResponse({
    type: UserDTO
  })
  @Get('me')
  async getUser(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @ApiParam({
    name: 'id',
    description: 'User ID'
  })
  @Get(':id')
  read(@Param('id', ParseIntPipe) id: number) {
    return this.userService.read(id);
  }

  @ApiParam({
    name: 'id',
    description: 'User ID'
  })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }


  @ApiParam({
    name: 'id',
    description: 'User ID'
  })
  @ApiBody({
    type: UpdateUserDTO
  })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe({
    expectedType: UpdateUserDTO,
    whitelist: true
  })) body: UpdateUserDTO) {
    return this.userService.update(id, body);
  }

  @ApiBody({
    type: CreateUserDTO
  })
  @Post('create')
  create(@Body(new ValidationPipe({
    expectedType: CreateUserDTO,
    whitelist: true
  })) body: CreateUserDTO) {
    return this.userService.create(body);
  }


}
