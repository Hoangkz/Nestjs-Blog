import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const [type, accesstoken] = req.headers.authorization ? req.headers.authorization.split(' ') : [];
    if (type !== "Bearer") {
      next()
    }
    if (accesstoken != "null") {
      try {
        await this.jwtService.verifyAsync(accesstoken);
      } catch (error) {
        const token = await fetch(process.env.SERVER_BE + "/auth/refresh-token", {
          method: "POST",
          body: JSON.stringify(accesstoken),
          headers: {
            "Content-Type": "application/json"
          },

        })
        console.log(token)
      }
    }

    next();
  }
}
