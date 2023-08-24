import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    console.log(exception);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json(exception);
      return;
    }

    const customRpcException = exception as { message: string; statusCode: number };
    if (customRpcException?.statusCode) {
      response.status(customRpcException.statusCode).json(customRpcException);
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(exception);
  }
}
