import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from '../../persistence/user/user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get(':id')
  read(@Param('id', ParseIntPipe) id: number) {
    return this.userService.read(id);
  }

  @Get(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.userService.update(id, body);
  }

  @Post('create')
  create(@Body() body: any) {
    return this.userService.create(body);
  }
}
