import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionRes: any = exception.getResponse() as
      | string
      | { error: string; message: string };

    console.error(`exception : `, exceptionRes);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,

      isSuccess: false,
      message: exceptionRes.message ? exceptionRes.message : exceptionRes,
      error: exceptionRes.error ? exceptionRes.error : exceptionRes,
    });
  }
}
