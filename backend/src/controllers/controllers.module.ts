import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from '../persistence/user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { ColumnController } from './column/column.controller';
import { CardController } from './card/card.controller';
import { ColumnModule } from '../persistence/column/column.module';
import { CardModule } from '../persistence/card/card.module';
import { BoardGatewayModule } from './board/board-gateway.module';
import { BlCardModule } from '../business-logic/bl-card/bl-card.module';

@Module({
  imports: [UserModule, AuthModule, ColumnModule, CardModule, BoardGatewayModule, BlCardModule],
  controllers: [UserController, AuthController, ColumnController, CardController],
  providers: [],
})
export class ControllersModule {}
