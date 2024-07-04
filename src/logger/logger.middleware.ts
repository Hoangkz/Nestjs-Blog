import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ExtractTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'You do not have access' });
    }
    const [type, token] = authHeader.split(" ")
    if (token && type === 'Bearer') {
      const user = this.jwtService.verify(token)
      if (user && user.id) {
        req['user'] = user;
        return next()
      }
      else {
        return res.status(403).json({ message: 'You do not have access' });
      }
    }
    else {
      return res.status(403).json({ message: 'You do not have access' });
    }
  }
}
