import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { SensorsDataService } from './sensors.data.service';
import { ClientMock } from '../mocks/client.mock';

describe('SensorsDataService', () => {
  let userClientMock: ClientMock;
  let service: SensorsDataService;

  beforeEach(async () => {
    userClientMock = new ClientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsDataService,
        {
          provide: 'SENSOR_DATA_SERVICE',
          useValue: userClientMock.build(),
        },
      ],
    }).compile();

    service = module.get(SensorsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateValue', () => {
    it('should send updata data command to sensor data service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';
      const dataPayload = {
        timestamp: new Date().toISOString(),
        value: 1,
      };

      // Act & Assert
      expect(
        await service.updateValue(userId, deviceId, deviceTopic, dataPayload),
      ).toEqual({
        pattern: { cmd: 'sensors.data.update' },
        payload: { userId, deviceId, deviceTopic, dataPayload },
      });
    });

    it('should throw an error if sensor data service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';
      const dataPayload = {
        timestamp: new Date().toISOString(),
        value: 1,
      };
      const error = new RpcException('Sensor data service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.updateValue(userId, deviceId, deviceTopic, dataPayload),
      ).rejects.toThrow(error);
    });
  });

  describe('getLatestData', () => {
    it('should send get latest data command to sensor data service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';

      // Act & Assert
      expect(
        await service.getLatestData(userId, deviceId, deviceTopic),
      ).toEqual({
        pattern: { cmd: 'sensors.data.get.latest' },
        payload: { userId, deviceId, deviceTopic },
      });
    });

    it('should throw an error if sensor data service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';
      const error = new RpcException('Sensor data service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.getLatestData(userId, deviceId, deviceTopic),
      ).rejects.toThrow(error);
    });
  });

  describe('getPeriodicData', () => {
    it('should send get periodic data command to sensor data service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';
      const from = new Date(Date.now() - 10000).toISOString();
      const to = new Date().toISOString();

      // Act & Assert
      expect(
        await service.getPeriodicData(userId, deviceId, deviceTopic, from, to),
      ).toEqual({
        pattern: { cmd: 'sensors.data.get.periodic' },
        payload: { userId, deviceId, deviceTopic, from, to },
      });
    });

    it('should throw an error if sensor data service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopic = 'temperature';
      const from = new Date(Date.now() - 10000).toISOString();
      const to = new Date().toISOString();
      const error = new RpcException('Sensor data service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.getPeriodicData(userId, deviceId, deviceTopic, from, to),
      ).rejects.toThrow(error);
    });
  });
});
