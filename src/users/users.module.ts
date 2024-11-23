import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [DevicesModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
