import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesServiceMock } from './mocks/devices.service.mock';

describe('DevicesController', () => {
  let controller: DevicesController;
  let service: DevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
    })
      .useMocker((token) => {
        switch (token) {
          case DevicesService:
            return DevicesServiceMock.build();
        }
      })
      .compile();

    controller = module.get(DevicesController);
    service = module.get(DevicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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
  });
});
