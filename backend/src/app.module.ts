import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './business-logic/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './persistence/user/user.entity';
import { AuthMiddleware } from './auth.middleware';
import { ControllersModule } from './controllers/controllers.module';
import { UserService } from './persistence/user/user.service';
import { UserModule } from './persistence/user/user.module';
import { BasePersistenceService } from './persistence/base/base-persistence.service';
import { AuthModule } from './business-logic/auth/auth.module';
import { AlsModule } from './als/als.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    autoLoadEntities: true,
    database: 'database.sqlite',
    logging: [],
    logger: 'simple-console',
    synchronize: true, // I wouldn't do that in a real production app, but for simplicity reasons I will leave it true
  }),
    TypeOrmModule.forFeature([UserEntity]),
  JwtModule.register({ secret: process.env.JWT_SECRET ?? 'portofolio-only-fallback', global: true }),
  ControllersModule,
    AuthModule,
    AlsModule,
  UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('api', 'api/auth/{*path}').forRoutes('api/{*path}');
  }
}
