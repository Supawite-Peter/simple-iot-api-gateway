import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from './rpc.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
