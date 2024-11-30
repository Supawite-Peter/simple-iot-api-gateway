import {
  Post,
  Delete,
  Body,
  Request,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from '../auth/auth.public';
import { UsersService } from './users.service';
import { RegisterDto, registerSchema } from './dto/register.dto';
import { UnregisterDto, unregisterSchema } from './dto/unregister.dto';
import { ZodValidationPipe } from '../zod.validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('')
  register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.usersService.register(
      registerDto.username,
      registerDto.password,
    );
  }

  @Delete('')
  unregister(
    @Request() req,
    @Body(new ZodValidationPipe(unregisterSchema)) unregisterDto: UnregisterDto,
  ) {
    return this.usersService.unregister(req.user.sub, unregisterDto.password);
  }

  @Get(':userId')
  getUserDetails(
    @Request() req,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    // Only allow user to get their own details
    return req.user.sub === userId
      ? this.usersService.getUserDetails(req.user.sub)
      : new UnauthorizedException();
  }
}
