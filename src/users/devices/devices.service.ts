import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class DevicesService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async register(
    userId: number,
    deviceName: string,
    deviceTopics: string[],
  ): Promise<any> {
    const pattern = { cmd: 'devices.register' };
    const payload = { userId, deviceName, deviceTopics };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async unregister(userId: number, deviceId: number): Promise<any> {
    const pattern = { cmd: 'devices.unregister' };
    const payload = { userId, deviceId };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async getDevicesList(userId: number): Promise<any> {
    const pattern = { cmd: 'devices.list' };
    const payload = { userId };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async getDeviceDetails(userId: number, deviceId: number): Promise<any> {
    const pattern = { cmd: 'devices.details' };
    const payload = { userId, deviceId };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async addDeviceTopics(
    userId: number,
    deviceId: number,
    deviceTopics: string[] | string,
  ): Promise<any> {
    const pattern = { cmd: 'devices.topics.add' };
    const payload = { userId, deviceId, deviceTopics };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async removeDeviceTopics(
    userId: number,
    deviceId: number,
    deviceTopics: string[] | string,
  ): Promise<any> {
    const pattern = { cmd: 'devices.topics.remove' };
    const payload = { userId, deviceId, deviceTopics };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }
}
