import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { DevicesService } from './devices.service';
import { ClientMock } from '../../mocks/client.mock';

describe('DevicesService', () => {
  let userClientMock: ClientMock;
  let service: DevicesService;

  beforeEach(async () => {
    userClientMock = new ClientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: 'USER_SERVICE',
          useValue: userClientMock.build(),
        },
      ],
    }).compile();

    service = module.get(DevicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should send device register command to user service', async () => {
      // Arrange
      const userId = 1;
      const deviceName = 'deviceName';
      const deviceTopics = ['topic1', 'topic2'];

      // Act & Assert
      expect(await service.register(userId, deviceName, deviceTopics)).toEqual({
        pattern: { cmd: 'devices.register' },
        payload: { userId, deviceName, deviceTopics },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceName = 'deviceName';
      const deviceTopics = ['topic1', 'topic2'];
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.register(userId, deviceName, deviceTopics),
      ).rejects.toThrow(error);
    });
  });

  describe('unregister', () => {
    it('should send device unregister command to user service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;

      // Act & Assert
      expect(await service.unregister(userId, deviceId)).toEqual({
        pattern: { cmd: 'devices.unregister' },
        payload: { userId, deviceId },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.unregister(userId, deviceId)).rejects.toThrow(error);
    });
  });

  describe('getDevicesList', () => {
    it('should send get device list command to user service', async () => {
      // Arrange
      const userId = 1;

      // Act & Assert
      expect(await service.getDevicesList(userId)).toEqual({
        pattern: { cmd: 'devices.list' },
        payload: { userId },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.getDevicesList(userId)).rejects.toThrow(error);
    });
  });

  describe('getDeviceDetails', () => {
    it('should send get device details command to user service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;

      // Act & Assert
      expect(await service.getDeviceDetails(userId, deviceId)).toEqual({
        pattern: { cmd: 'devices.details' },
        payload: { userId, deviceId },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.getDeviceDetails(userId, deviceId)).rejects.toThrow(
        error,
      );
    });
  });

  describe('addDeviceTopics', () => {
    it('should send add device topics command to user service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopics = ['topic1', 'topic2'];

      // Act & Assert
      expect(
        await service.addDeviceTopics(userId, deviceId, deviceTopics),
      ).toEqual({
        pattern: { cmd: 'devices.topics.add' },
        payload: { userId, deviceId, deviceTopics },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopics = ['topic1', 'topic2'];
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.addDeviceTopics(userId, deviceId, deviceTopics),
      ).rejects.toThrow(error);
    });
  });

  describe('removeDeviceTopics', () => {
    it('should send remove device topics command to user service', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopics = ['topic1', 'topic2'];

      // Act & Assert
      expect(
        await service.removeDeviceTopics(userId, deviceId, deviceTopics),
      ).toEqual({
        pattern: { cmd: 'devices.topics.remove' },
        payload: { userId, deviceId, deviceTopics },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const deviceId = 1;
      const deviceTopics = ['topic1', 'topic2'];
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(
        service.removeDeviceTopics(userId, deviceId, deviceTopics),
      ).rejects.toThrow(error);
    });
  });
});
