import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.table({
      Status: 'Request',
      URL: req.url,
      Method: req.method,
      Time: new Date().toDateString(),
    });
    next();
  }
}
