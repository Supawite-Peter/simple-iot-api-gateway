import {
  Controller,
  Get,
  Post,
  Request,
  Delete,
  Body,
  Param,
  UsePipes,
  ParseIntPipe,
  ParseArrayPipe,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DevicesService } from './devices.service';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { GET_DEVICES_LIST_CACHE_PREFIX } from './caches/cache.prefix';

@Controller('devices')
export class DevicesController {
  constructor(
    private devicesService: DevicesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Request() req, @Body() registerDto: RegisterDto) {
    this.cacheManager.del(`${GET_DEVICES_LIST_CACHE_PREFIX}/${req.user.sub}`);
    return this.devicesService.register(
      req.user.sub,
      registerDto.name,
      registerDto.topics,
    );
  }

  @Delete('')
  unregister(@Request() req, @Body('id', ParseIntPipe) deviceId: number) {
    this.cacheManager.del(`${GET_DEVICES_LIST_CACHE_PREFIX}/${req.user.sub}`);
    return this.devicesService.unregister(req.user.sub, deviceId);
  }

  @Get('')
  async list(@Request() req) {
    // Get from cache
    const cacheKey = `${GET_DEVICES_LIST_CACHE_PREFIX}/${req.user.sub}`;
    const cachedValue = await this.cacheManager.get(cacheKey);

    // If cache exists, return
    if (cachedValue) return cachedValue;

    // Else, get devices list from service
    const result = await this.devicesService.getDevicesList(req.user.sub);
    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  @Post(':deviceId/topics')
  addTopic(
    @Request() req,
    @Body('topics', ParseArrayPipe) topics: string[],
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ) {
    this.cacheManager.del(`${GET_DEVICES_LIST_CACHE_PREFIX}/${req.user.sub}`);
    return this.devicesService.addDeviceTopics(req.user.sub, deviceId, topics);
  }

  @Delete(':deviceId/topics')
  removeTopic(
    @Request() req,
    @Body('topics', ParseArrayPipe) topics: string[],
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ) {
    this.cacheManager.del(`${GET_DEVICES_LIST_CACHE_PREFIX}/${req.user.sub}`);
    return this.devicesService.removeDeviceTopics(
      req.user.sub,
      deviceId,
      topics,
    );
  }
}
