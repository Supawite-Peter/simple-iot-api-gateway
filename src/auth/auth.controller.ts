import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign.in.dto';
import { Public } from './auth.public';
import { Refresh } from './auth.refresh';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Get token
    const signedToken = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    // Set cookie
    res.cookie('accessToken', signedToken.token.accessToken, {
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + ms(process.env.COOKIE_ACCESS_TOKEN_EXP)),
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    res.cookie('refreshToken', signedToken.token.refreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
      expires: new Date(Date.now() + ms(process.env.COOKIE_REFRESH_TOKEN_EXP)),
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    // Return user details
    return { id: signedToken.user.sub, username: signedToken.user.username };
  }

  @Refresh()
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Get access token
    const accessToken = await this.authService.requestAccessToken(
      req.user.sub,
      req.user.username,
    );

    // Set cookie
    res.cookie('accessToken', accessToken.token, {
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + ms(process.env.COOKIE_ACCESS_TOKEN_EXP)),
      secure: process.env.NODE_ENV === 'production' ? true : false,
    });

    // Return user details
    return { id: accessToken.user.sub, username: accessToken.user.username };
  }
}
