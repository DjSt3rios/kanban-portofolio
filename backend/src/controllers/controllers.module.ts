import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from '../persistence/user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { ColumnController } from './column/column.controller';
import { CardController } from './card/card.controller';
import { ColumnModule } from '../persistence/column/column.module';
import { CardModule } from '../persistence/card/card.module';

@Module({
  imports: [UserModule, AuthModule, ColumnModule, CardModule],
  controllers: [UserController, AuthController, ColumnController, CardController],
})
export class ControllersModule {}
