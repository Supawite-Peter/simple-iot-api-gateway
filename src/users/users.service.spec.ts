import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { ClientMock } from '../mocks/client.mock';

describe('UsersService', () => {
  let userClientMock: ClientMock;
  let service: UsersService;

  beforeEach(async () => {
    userClientMock = new ClientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_SERVICE',
          useValue: userClientMock.build(),
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should send user register command to user service', async () => {
      // Arrange
      const username = 'username';
      const password = 'password';

      // Act & Assert
      expect(await service.register(username, password)).toEqual({
        pattern: { cmd: 'users.register' },
        payload: { username, password },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const username = 'username';
      const password = 'password';
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.register(username, password)).rejects.toThrow(error);
    });
  });

  describe('unregister', () => {
    it('should send user unregister command to user service', async () => {
      // Arrange
      const userId = 1;
      const password = 'password';

      // Act & Assert
      expect(await service.unregister(userId, password)).toEqual({
        pattern: { cmd: 'users.unregister' },
        payload: { userId, password },
      });
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const password = 'password';
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.unregister(userId, password)).rejects.toThrow(error);
    });
  });
});
