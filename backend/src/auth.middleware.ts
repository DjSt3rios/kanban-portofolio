import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './persistence/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, private als: AsyncLocalStorage<any>) {
  }
  async use(req: Request, res: Response, next: () => void) {
    if (!req.headers.authorization) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        isError: true,
        message: 'Unauthorized'
      });
      return;
    }
    const token = req.headers.authorization;
    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        isError: true,
        message: 'Unauthorized'
      });
      return;
    }
    const user = await this.userRepo.findOneBy({
      id: payload?.sub,
      username: payload?.username
    });
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        isError: true,
        message: 'Unauthorized'
      });
      return;
    }
    req['user'] = user;
    next();
  }
}
