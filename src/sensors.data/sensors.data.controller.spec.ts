import { Test, TestingModule } from '@nestjs/testing';
import { SensorsDataController } from './sensors.data.controller';
import { SensorsDataService } from './sensors.data.service';
import { SensorsDataServiceMock } from './mocks/sensors.data.service.mock';

describe('SensorsDataController', () => {
  let controller: SensorsDataController;
  let service: SensorsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsDataController],
    })
      .useMocker((token) => {
        switch (token) {
          case SensorsDataService:
            return SensorsDataServiceMock.build();
        }
      })
      .compile();

    controller = module.get(SensorsDataController);
    service = module.get(SensorsDataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('[POST] /devices/:deviceId/:topic', () => {
    it('should send data to service.updateValue', async () => {
      // Act & Assert
      expect(
        await controller.updateValue(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          {
            payload: {
              timestamp: new Date().toISOString(),
              value: 1,
            },
          },
          1,
          'topic1',
        ),
      ).toEqual('updateValue Received');
      expect(service.updateValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('[GET] /devices/:deviceId/:topic/latest', () => {
    it('should send data to service.getLatestData', async () => {
      // Act & Assert
      expect(
        await controller.getLatestData(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          1,
          'topic1',
        ),
      ).toEqual('getLatestData Received');
      expect(service.getLatestData).toHaveBeenCalledTimes(1);
    });
  });

  describe('[GET] /devices/:deviceId/:topic/periodic', () => {
    it('should send data to service.getPeriodicData', async () => {
      // Act & Assert
      expect(
        await controller.getPeriodicData(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          {
            from: new Date().toISOString(),
            to: new Date().toDateString(),
          },
          1,
          'topic1',
        ),
      ).toEqual('getPeriodicData Received');
      expect(service.getPeriodicData).toHaveBeenCalledTimes(1);
    });
  });
});
