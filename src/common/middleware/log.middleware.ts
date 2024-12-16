import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let request = null;
    switch (req.method) {
      case 'GET':
        request = req.query ?? req.params;
        break;
      case 'POST':
      case 'PUT':
      case 'PATCH':
        request = req.body;
        break;
      default:
        break;
    }
    console.log(
      `\x1b[01m\x1b[95m[${new Date().toDateString()}] . \x1b[31m[Request] . \x1b[34m[${req.method}] . \x1b[32m[${req.url}] ${request ? '. \x1b[96m' + JSON.stringify(request) : ''} \x1b[0m`,
    );
    next();
  }
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.getArgByIndex(0);
    console.log(
      `\x1b[01m\x1b[95m[${new Date().toDateString()}] . \x1b[31m[Response] . \x1b[33m[${response.res.statusCode}] . \x1b[34m[${response.method}] . \x1b[32m[${response.url}]\x1b[0m`,
    );
    return next.handle().pipe(
      map((data) => ({
        success: true,
        ...data,
      })),
    );
  }
}
