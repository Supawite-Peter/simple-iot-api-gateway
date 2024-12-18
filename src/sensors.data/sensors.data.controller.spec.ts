import { Test, TestingModule } from '@nestjs/testing';
import { SensorsDataController } from './sensors.data.controller';
import { SensorsDataService } from './sensors.data.service';
import { SensorsDataServiceMock } from './mocks/sensors.data.service.mock';
import { CacheMock } from '../mocks/cache.mock';
import { Cache } from 'cache-manager';
import { GET_PERIODIC_DATA_CACHE_PREFIX } from './caches/cache.prefix';

describe('SensorsDataController', () => {
  let controller: SensorsDataController;
  let service: SensorsDataService;
  let cache: Cache;
  let cacheMock: CacheMock;

  beforeEach(async () => {
    cacheMock = new CacheMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsDataController],
    })
      .useMocker((token) => {
        switch (token) {
          case SensorsDataService:
            return SensorsDataServiceMock.build();
          case 'CACHE_MANAGER':
            return cacheMock.build();
        }
      })
      .compile();

    controller = module.get(SensorsDataController);
    service = module.get(SensorsDataService);
    cache = module.get('CACHE_MANAGER');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(cache).toBeDefined();
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
    it('should send data to service.getLatestData (no unix)', async () => {
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

    it('should send data to service.getLatestData (unix)', async () => {
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
          true,
        ),
      ).toEqual('getLatestData Received');
      expect(service.getLatestData).toHaveBeenCalledTimes(1);
    });
  });

  describe('[GET] /devices/:deviceId/:topic/periodic', () => {
    it('should send data to service.getPeriodicData (no unix)', async () => {
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

    it('should send data to service.getPeriodicData (unix)', async () => {
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
            unix: true,
          },
          1,
          'topic1',
        ),
      ).toEqual('getPeriodicData Received');
      expect(service.getPeriodicData).toHaveBeenCalledTimes(1);
    });

    it('should get periodic data from cache if exists (no unix)', async () => {
      // Arrage
      const deviceId = 1;
      const topic = 'topic1';
      const from = new Date().toISOString();
      const to = new Date().toDateString();
      const cacheKey = `${GET_PERIODIC_DATA_CACHE_PREFIX}/${deviceId}/${topic}/${from}/${to}/false`;
      cacheMock.set(cacheKey, 'Data from cache');

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
            from: from,
            to: to,
          },
          deviceId,
          topic,
        ),
      ).toEqual('Data from cache');
      expect(service.getPeriodicData).toHaveBeenCalledTimes(0);
    });

    it('should get periodic data from cache if exists (unix)', async () => {
      // Arrage
      const deviceId = 1;
      const topic = 'topic1';
      const from = new Date().toISOString();
      const to = new Date().toDateString();
      const unix = true;
      const cacheKey = `${GET_PERIODIC_DATA_CACHE_PREFIX}/${deviceId}/${topic}/${from}/${to}/${unix}`;
      cacheMock.set(cacheKey, 'Data from cache');

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
            from: from,
            to: to,
            unix: unix,
          },
          deviceId,
          topic,
        ),
      ).toEqual('Data from cache');
      expect(service.getPeriodicData).toHaveBeenCalledTimes(0);
    });
  });
});
