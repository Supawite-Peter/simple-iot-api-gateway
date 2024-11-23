import { Module } from '@nestjs/common';
import { SensorsDataController } from './sensors.data.controller';
import { SensorsDataService } from './sensors.data.service';

@Module({
  controllers: [SensorsDataController],
  providers: [SensorsDataService],
})
export class SensorsDataModule {}
