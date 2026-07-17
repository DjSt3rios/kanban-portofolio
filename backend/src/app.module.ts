import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './persistence/user/user.entity';
import { AuthMiddleware } from './auth.middleware';
import { ControllersModule } from './controllers/controllers.module';
import { UserService } from './persistence/user/user.service';
import { UserModule } from './persistence/user/user.module';
import { BasePersistenceService } from './persistence/base/base-persistence.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    autoLoadEntities: true,
    database: 'database.sqlite',
    logging: ['schema', 'info', 'error', 'query', 'migration'],
    logger: 'simple-console',
    synchronize: true, // I wouldn't do that in a real production app, but for simplicity reasons I will leave it true
  }),
  JwtModule.register({ secret: process.env.JWT_SECRET ?? 'portofolio-only-fallback' }),
  TypeOrmModule.forFeature([UserEntity]),
  ControllersModule,
  UserModule],
  controllers: [],
  providers: [AuthService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('api').forRoutes('api/{*path}');
  }
}
