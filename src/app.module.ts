import { Module } from '@nestjs/common';
import { GlobalClientsModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SensorsDataModule } from './sensors.data/sensors.data.module';

@Module({
  imports: [GlobalClientsModule, AuthModule, UsersModule, SensorsDataModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
