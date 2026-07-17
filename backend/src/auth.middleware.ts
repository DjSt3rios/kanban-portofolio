import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    if (!req.headers.authorization) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        isError: true,
        message: 'Unauthorized'
      });
      return;
    }
    next();
  }
}
