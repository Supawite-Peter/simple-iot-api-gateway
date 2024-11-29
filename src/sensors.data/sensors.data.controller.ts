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
  ParseBoolPipe,
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
import { GET_PERIODIC_DATA_CACHE_PREFIX } from './caches/cache.prefix';

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
    @Query('unix', new ParseBoolPipe({ optional: true }))
    unix?: boolean,
  ) {
    const result = await this.sensorsDataService.getLatestData(
      req.user.sub,
      deviceId,
      topic,
      unix,
    );

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
    const { from, to, unix } = queryDevicesDataPeriodicDto;
    const cacheKey = `${GET_PERIODIC_DATA_CACHE_PREFIX}/${deviceId}/${topic}/${from}/${to}/${unix ? unix : false}`;
    const cachedValue = await this.cacheManager.get(cacheKey);

    // If cache exists, return
    if (cachedValue) return cachedValue;

    // Else, get latest data from service
    const result = await this.sensorsDataService.getPeriodicData(
      req.user.sub,
      deviceId,
      topic,
      from,
      to,
      unix, // if true, return timestamp in milliseconds else return timestamp in ISO
    );
    await this.cacheManager.set(cacheKey, result);

    return result;
  }
}
