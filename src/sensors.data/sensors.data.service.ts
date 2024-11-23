import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SensorsPayloadDataDto } from './dto/data.dto';
import { catchError, throwError, firstValueFrom } from 'rxjs';

@Injectable()
export class SensorsDataService {
  constructor(@Inject('SENSOR_DATA_SERVICE') private client: ClientProxy) {}

  async updateValue(
    userId: number,
    deviceId: number,
    deviceTopic: string,
    dataPayload: SensorsPayloadDataDto[] | SensorsPayloadDataDto,
  ) {
    const pattern = { cmd: 'sensors.data.update' };
    const payload = { userId, deviceId, deviceTopic, dataPayload };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async getLatestData(userId: number, deviceId: number, deviceTopic: string) {
    const pattern = { cmd: 'sensors.data.get.latest' };
    const payload = { userId, deviceId, deviceTopic };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }

  async getPeriodicData(
    userId: number,
    deviceId: number,
    deviceTopic: string,
    from: string,
    to: string,
  ) {
    const pattern = { cmd: 'sensors.data.get.periodic' };
    const payload = { userId, deviceId, deviceTopic, from, to };
    return firstValueFrom(
      this.client
        .send(pattern, payload)
        .pipe(catchError((err) => throwError(() => new RpcException(err)))),
    );
  }
}
