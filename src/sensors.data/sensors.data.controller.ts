import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Param,
  ParseIntPipe,
  Inject,
  Query,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SensorsDataService } from './sensors.data.service';
import { SensorsDataDto, sensorsDataSchema } from './dto/data.dto';
import {
  SensorsDataPeriodicDto,
  sensorsDataPeriodicSchema,
} from './dto/data.periodic.dto';
import { ZodValidationPipe } from '../zod.validation.pipe';
import {
  GET_LATEST_DATA_CACHE_PREFIX,
  GET_PERIODIC_DATA_CACHE_PREFIX,
} from './caches/cache.prefix';

@Controller('devices')
export class SensorsDataController {
  constructor(
    private sensorsDataService: SensorsDataService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post(':deviceId/:topic')
  updateValue(
    @Request() req,
    @Body(new ZodValidationPipe(sensorsDataSchema))
    sensorsDataDto: SensorsDataDto,
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Param('topic') topic: string,
  ) {
    this.cacheManager.del(
      `${GET_LATEST_DATA_CACHE_PREFIX}/${deviceId}/${topic}`,
    );
    return this.sensorsDataService.updateValue(
      req.user.sub,
      deviceId,
      topic,
      sensorsDataDto.payload,
    );
  }

  @Get(':deviceId/:topic/latest')
  async getLatestData(
    @Request() req,
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Param('topic') topic: string,
  ) {
    // Get from cache
    const cacheKey = `${GET_LATEST_DATA_CACHE_PREFIX}/${deviceId}/${topic}`;
    const cachedValue = await this.cacheManager.get(cacheKey);

    // If cache exists, return
    if (cachedValue) return cachedValue;

    // Else, get latest data from service
    const result = await this.sensorsDataService.getLatestData(
      req.user.sub,
      deviceId,
      topic,
    );
    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  @Get(':deviceId/:topic/periodic')
  async getPeriodicData(
    @Request() req,
    @Query(new ZodValidationPipe(sensorsDataPeriodicSchema))
    queryDevicesDataPeriodicDto: SensorsDataPeriodicDto,
    @Param('deviceId', ParseIntPipe)
    deviceId: number,
    @Param('topic') topic: string,
  ) {
    // Get from cache
    const cacheKey = `${GET_PERIODIC_DATA_CACHE_PREFIX}/${deviceId}/${topic}/${queryDevicesDataPeriodicDto.from}/${queryDevicesDataPeriodicDto.to}`;
    const cachedValue = await this.cacheManager.get(cacheKey);

    // If cache exists, return
    if (cachedValue) return cachedValue;

    // Else, get latest data from service
    const result = await this.sensorsDataService.getPeriodicData(
      req.user.sub,
      deviceId,
      topic,
      queryDevicesDataPeriodicDto.from,
      queryDevicesDataPeriodicDto.to,
    );
    await this.cacheManager.set(cacheKey, result);

    return result;
  }
}
