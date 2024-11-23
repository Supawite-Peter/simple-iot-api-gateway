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
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { ZodValidationPipe } from '../../zod.validation.pipe';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post('')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Request() reg, @Body() registerDto: RegisterDto) {
    return this.devicesService.register(
      reg.user.sub,
      registerDto.name,
      registerDto.topics,
    );
  }

  @Delete('')
  unregister(@Request() req, @Body('id', ParseIntPipe) deviceId: number) {
    return this.devicesService.unregister(req.user.sub, deviceId);
  }

  @Get('')
  list(@Request() req) {
    return this.devicesService.getDevicesList(req.user.sub);
  }

  @Post(':deviceId/topics')
  addTopic(
    @Request() req,
    @Body('topics', ParseArrayPipe) topics: string[],
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ) {
    return this.devicesService.addDeviceTopics(req.user.sub, deviceId, topics);
  }

  @Delete(':deviceId/topics')
  removeTopic(
    @Request() req,
    @Body('topics', ParseArrayPipe) topics: string[],
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ) {
    return this.devicesService.removeDeviceTopics(
      req.user.sub,
      deviceId,
      topics,
    );
  }
}
