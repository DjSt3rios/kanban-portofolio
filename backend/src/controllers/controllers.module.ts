import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from '../persistence/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [UserController]
})
export class ControllersModule {}
