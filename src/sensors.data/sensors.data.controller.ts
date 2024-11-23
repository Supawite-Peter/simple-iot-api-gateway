import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SensorsDataService } from './sensors.data.service';
import { SensorsDataDto, sensorsDataSchema } from './dto/data.dto';
import {
  SensorsDataPeriodicDto,
  sensorsDataPeriodicSchema,
} from './dto/data.periodic.dto';
import { ZodValidationPipe } from '../zod.validation.pipe';

@Controller('devices')
export class SensorsDataController {
  constructor(private sensorsDataService: SensorsDataService) {}

  @Post(':deviceId/:topic')
  updateValue(
    @Request() req,
    @Body(new ZodValidationPipe(sensorsDataSchema))
    sensorsDataDto: SensorsDataDto,
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Param('topic') topic: string,
  ) {
    return this.sensorsDataService.updateValue(
      req.user.sub,
      deviceId,
      topic,
      sensorsDataDto.payload,
    );
  }

  @Get(':deviceId/:topic/latest')
  getLatestData(
    @Request() req,
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Param('topic') topic: string,
  ) {
    return this.sensorsDataService.getLatestData(req.user.sub, deviceId, topic);
  }

  @Get(':deviceId/:topic/periodic')
  getPeriodicData(
    @Request() req,
    @Body(new ZodValidationPipe(sensorsDataPeriodicSchema))
    devicesDataPeriodicDto: SensorsDataPeriodicDto,
    @Param('deviceId', ParseIntPipe)
    deviceId: number,
    @Param('topic') topic: string,
  ) {
    return this.sensorsDataService.getPeriodicData(
      req.user.sub,
      deviceId,
      topic,
      devicesDataPeriodicDto.from,
      devicesDataPeriodicDto.to,
    );
  }
}
