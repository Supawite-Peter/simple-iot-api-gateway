import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async signIn(username: string, password: string): Promise<any> {
    const pattern = { cmd: 'users.signin' };
    const payload = { username, password };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }
}
