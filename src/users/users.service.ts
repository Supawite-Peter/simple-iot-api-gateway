import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}
  async register(username: string, password: string): Promise<any> {
    const pattern = { cmd: 'users.register' };
    const payload = { username, password };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async unregister(userId: number, password: string): Promise<any> {
    const pattern = { cmd: 'users.unregister' };
    const payload = { userId, password };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async getUserDetails(userId: number): Promise<any> {
    const pattern = { cmd: 'users.details' };
    const payload = { userId };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }
}
