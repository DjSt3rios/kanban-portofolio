import { Module } from '@nestjs/common';
import { BoardGateway } from './board.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../persistence/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [BoardGateway],
  exports: [BoardGateway],
})
export class BoardGatewayModule {}
