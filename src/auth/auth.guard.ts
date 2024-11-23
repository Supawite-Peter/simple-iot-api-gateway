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

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    private refactor: Reflector,
  ) {}

  /**
   * Checks if the route is public, if it is, returns true immediately.
   * If the route is private, extracts the token from the request headers,
   * verifies it, and throws an UnauthorizedException if it's not valid.
   * If the token is valid, sets the user property in the request
   * and returns true.
   * @param context the execution context
   * @returns a promise that resolves to a boolean indicating
   * whether the route is accessible or not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the IS_PUBLIC_KEY metadata
    const isPublic = this.refactor.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If the route is public, allow access
    if (isPublic) {
      return true;
    }
    // Get the token from the request
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // If there's no token, throw an unauthorized error
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Verify the token
      const payload = await this.verifyToken(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string): Promise<any> {
    const pattern = { cmd: 'auth.token.verify' };
    const payload = { token };
    return await firstValueFrom(this.client.send(pattern, payload));
  }
}
