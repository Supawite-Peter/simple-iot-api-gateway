import { Logger, ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  private logger = new Logger(RpcExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (error?.response?.statusCode) {
      response.status(error.response.statusCode).json(error.response);
    } else {
      this.logger.error(error);
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}
