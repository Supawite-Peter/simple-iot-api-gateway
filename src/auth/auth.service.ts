import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async signIn(username: string, password: string): Promise<any> {
    const pattern = { cmd: 'users.signin' };
    const payload = { username, password };
    return firstValueFrom(
      this.userClient
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async requestAccessToken(userId: number, username: string): Promise<any> {
    const pattern = { cmd: 'auth.token.sign' };
    const payload = { userId, username, type: 'access' };
    return firstValueFrom(
      this.authClient
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }
}
