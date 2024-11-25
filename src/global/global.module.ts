import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const ENV = process.env.NODE_ENV;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}.local`,
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
            queue: process.env.RMQ_AUTH_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
            queue: process.env.RMQ_USER_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'SENSOR_DATA_SERVICE',
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
            queue: process.env.RMQ_SENSOR_DATA_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          },
          password: process.env.REDIS_PASSWORD || undefined,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: parseInt(process.env.REDIS_CACHE_TTL) * 60000, // minutes (milliseconds)
          isGlobal: true,
        };
      },
    }),
  ],
  exports: [ClientsModule, CacheModule],
})
export class GlobalClientsModule {}
