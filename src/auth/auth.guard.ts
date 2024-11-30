import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './auth.public';
import { IS_REFRESH_KEY } from './auth.refresh';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    private refactor: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If the route is public, allow access
    if (this.checkMetaData(context, IS_PUBLIC_KEY)) {
      return true;
    }

    // If the route is refresh, validate the refresh token else validate the access token
    if (this.checkMetaData(context, IS_REFRESH_KEY)) {
      return this.getAndValidateToken(context, 'refreshToken', 'refresh');
    } else {
      return this.getAndValidateToken(context, 'accessToken', 'access');
    }
  }

  private async getAndValidateToken(
    context: ExecutionContext,
    tokenKey: string,
    type: string,
  ): Promise<boolean> {
    // Get the token from the request
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.cookies[tokenKey];

    // If there's no token, throw an unauthorized error
    if (!token) {
      throw new UnauthorizedException(`No token provided for ${tokenKey}`);
    }
    try {
      // Verify the token
      const payload = await this.verifyToken(token, type);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(`Validation failed for ${tokenKey}`);
    }

    return true;
  }

  private async verifyToken(token: string, type: string): Promise<any> {
    const pattern = { cmd: 'auth.token.verify' };
    const payload = { token, type };
    return await firstValueFrom(this.client.send(pattern, payload));
  }

  private checkMetaData(context: ExecutionContext, key: string) {
    // check metadata
    return this.refactor.getAllAndOverride<boolean>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  /*
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  */
}
