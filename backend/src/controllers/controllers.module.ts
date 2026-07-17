import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from '../persistence/user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from '../business-logic/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [UserController, AuthController]
})
export class ControllersModule {}
