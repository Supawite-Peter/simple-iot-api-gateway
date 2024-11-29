import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesServiceMock } from './mocks/devices.service.mock';
import { CacheMock } from '../../mocks/cache.mock';
import { Cache } from 'cache-manager';
import {
  GET_DEVICES_LIST_CACHE_PREFIX,
  GET_DEVICE_DETAILS_CACHE_PREFIX,
} from './caches/cache.prefix';

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: DevicesService;
  let cache: Cache;
  let cacheMock: CacheMock;

  beforeEach(async () => {
    cacheMock = new CacheMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
    })
      .useMocker((token) => {
        switch (token) {
          case DevicesService:
            return DevicesServiceMock.build();
          case 'CACHE_MANAGER':
            return cacheMock.build();
        }
      })
      .compile();

    controller = module.get(DevicesController);
    service = module.get(DevicesService);
    cache = module.get('CACHE_MANAGER');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(cache).toBeDefined();
  });

  describe('[POST] /devices', () => {
    it('should send data to service.register', async () => {
      // Act & Assert
      expect(
        await controller.register(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          {
            name: 'device1',
            topics: ['topic1'],
          },
        ),
      ).toEqual('register Received');
      expect(service.register).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache for get device list/details', async () => {
      // Arrage
      const userId = 1;
      const cacheKey1 = `${GET_DEVICES_LIST_CACHE_PREFIX}/${userId}`;
      cacheMock.set(cacheKey1, 'Devices list from cache');

      // Act & Assert
      expect(
        await controller.register(
          {
            user: {
              username: 'user1',
              sub: userId,
            },
          },
          {
            name: 'device1',
            topics: ['topic1'],
          },
        ),
      ).toEqual('register Received');
      expect(service.register).toHaveBeenCalledTimes(1);
      expect(await cacheMock.get(cacheKey1)).toEqual(undefined);
    });
  });

  describe('[DELETE] /devices', () => {
    it('should send data to service.unregister', async () => {
      // Act & Assert
      expect(
        await controller.unregister(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          1,
        ),
      ).toEqual('unregister Received');
      expect(service.unregister).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache for get device list/details', async () => {
      // Arrage
      const userId = 1;
      const deviceId = 1;
      const cacheKey1 = `${GET_DEVICES_LIST_CACHE_PREFIX}/${userId}`;
      const cacheKey2 = `${GET_DEVICE_DETAILS_CACHE_PREFIX}/${userId}/${deviceId}`;
      cacheMock.set(cacheKey1, 'Devices list from cache');
      cacheMock.set(cacheKey2, 'Device details from cache');

      // Act & Assert
      expect(
        await controller.unregister(
          {
            user: {
              username: 'user1',
              sub: userId,
            },
          },
          deviceId,
        ),
      ).toEqual('unregister Received');
      expect(service.unregister).toHaveBeenCalledTimes(1);
      expect(await cacheMock.get(cacheKey1)).toEqual(undefined);
      expect(await cacheMock.get(cacheKey2)).toEqual(undefined);
    });
  });

  describe('[GET] /devices', () => {
    it('should send data to service.getDevicesList', async () => {
      // Act & Assert
      expect(
        await controller.list({
          user: {
            username: 'user1',
            sub: 1,
          },
        }),
      ).toEqual('getDevicesList Received');
      expect(service.getDevicesList).toHaveBeenCalledTimes(1);
    });

    it('should get devices list from cache if exists', async () => {
      // Arrage
      const userId = 1;
      const cacheKey = `${GET_DEVICES_LIST_CACHE_PREFIX}/${userId}`;
      cacheMock.set(cacheKey, 'Devices list from cache');

      // Act & Assert
      expect(
        await controller.list({
          user: {
            username: 'user1',
            sub: userId,
          },
        }),
      ).toEqual('Devices list from cache');
      expect(service.getDevicesList).toHaveBeenCalledTimes(0);
    });
  });

  describe('[GET] /devices/:deviceId', () => {
    it('should send data to service.getDeviceDetails', async () => {
      // Act & Assert
      expect(
        await controller.getDeviceDetails(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          1,
        ),
      ).toEqual('getDeviceDetails Received');
      expect(service.getDeviceDetails).toHaveBeenCalledTimes(1);
    });

    it('should get device details from cache if exists', async () => {
      // Arrage
      const userId = 1;
      const deviceId = 1;
      const cacheKey = `${GET_DEVICE_DETAILS_CACHE_PREFIX}/${userId}/${deviceId}`;
      cacheMock.set(cacheKey, 'Device details from cache');

      // Act & Assert
      expect(
        await controller.getDeviceDetails(
          {
            user: {
              username: 'user1',
              sub: userId,
            },
          },
          1,
        ),
      ).toEqual('Device details from cache');
      expect(service.getDeviceDetails).toHaveBeenCalledTimes(0);
    });
  });

  describe('[POST] /devices/:deviceId/topics', () => {
    it('should send data to service.addDeviceTopics', async () => {
      // Act & Assert
      expect(
        await controller.addTopic(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          ['topic1'],
          1,
        ),
      ).toEqual('addDeviceTopics Received');
      expect(service.addDeviceTopics).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache for get device list/details', async () => {
      // Arrage
      const userId = 1;
      const deviceId = 1;
      const cacheKey1 = `${GET_DEVICES_LIST_CACHE_PREFIX}/${userId}`;
      const cacheKey2 = `${GET_DEVICE_DETAILS_CACHE_PREFIX}/${userId}/${deviceId}`;
      cacheMock.set(cacheKey1, 'Devices list from cache');
      cacheMock.set(cacheKey2, 'Device details from cache');

      // Act & Assert
      expect(
        await controller.addTopic(
          {
            user: {
              username: 'user1',
              sub: userId,
            },
          },
          ['topic1'],
          deviceId,
        ),
      ).toEqual('addDeviceTopics Received');
      expect(service.addDeviceTopics).toHaveBeenCalledTimes(1);
      expect(await cacheMock.get(cacheKey1)).toEqual(undefined);
      expect(await cacheMock.get(cacheKey2)).toEqual(undefined);
    });
  });

  describe('[DELETE] /devices/:deviceId/topics', () => {
    it('should send data to service.removeDeviceTopics', async () => {
      // Act & Assert
      expect(
        await controller.removeTopic(
          {
            user: {
              username: 'user1',
              sub: 1,
            },
          },
          ['topic1'],
          1,
        ),
      ).toEqual('removeDeviceTopics Received');
      expect(service.removeDeviceTopics).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache for get device list/details', async () => {
      // Arrage
      const userId = 1;
      const deviceId = 1;
      const cacheKey1 = `${GET_DEVICES_LIST_CACHE_PREFIX}/${userId}`;
      const cacheKey2 = `${GET_DEVICE_DETAILS_CACHE_PREFIX}/${userId}/${deviceId}`;
      cacheMock.set(cacheKey1, 'Devices list from cache');
      cacheMock.set(cacheKey2, 'Device details from cache');

      // Act & Assert
      expect(
        await controller.removeTopic(
          {
            user: {
              username: 'user1',
              sub: userId,
            },
          },
          ['topic1'],
          deviceId,
        ),
      ).toEqual('removeDeviceTopics Received');
      expect(service.removeDeviceTopics).toHaveBeenCalledTimes(1);
      expect(await cacheMock.get(cacheKey1)).toEqual(undefined);
      expect(await cacheMock.get(cacheKey2)).toEqual(undefined);
    });
  });
});
