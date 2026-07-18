import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './persistence/user/user.entity';
import { AuthMiddleware } from './auth.middleware';
import { ControllersModule } from './controllers/controllers.module';
import { UserModule } from './persistence/user/user.module';
import { AuthModule } from './auth/auth.module';
import { AlsModule } from './als/als.module';
import { BoardModule } from './persistence/board/board.module';

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
    UserModule,
    BoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('api', 'api/auth/{*path}').forRoutes('api/{*path}');
  }
}
