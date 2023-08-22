import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class MicroserviceAllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): Observable<any> {
    if (host.getType() !== 'rpc') throw new Error('Filter execution context violation');
    console.log(exception.stack);

    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    return throwError(() => ({ message: 'Internal server error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR }));
  }
}
