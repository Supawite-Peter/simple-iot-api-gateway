import { Test, TestingModule } from '@nestjs/testing';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ClientMock } from '../mocks/client.mock';

describe('AuthService', () => {
  let userClientMock: ClientMock;
  let authClientMock: ClientMock;
  let service: AuthService;
  let userClient: ClientProxy;
  let authClient: ClientProxy;

  beforeEach(async () => {
    userClientMock = new ClientMock();
    authClientMock = new ClientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_SERVICE',
          useValue: userClientMock.build(),
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: authClientMock.build(),
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userClient = module.get('USER_SERVICE');
    authClient = module.get('AUTH_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should send sign in command to user service', async () => {
      // Arrange
      const username = 'username';
      const password = 'password';

      // Act & Assert
      expect(await service.signIn(username, password)).toEqual({
        pattern: { cmd: 'users.signin' },
        payload: { username, password },
      });
      expect(userClient.send).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const username = 'username';
      const password = 'password';
      const error = new RpcException('User service error');
      userClientMock.error = error;

      // Act & Assert
      await expect(service.signIn(username, password)).rejects.toThrow(error);
    });
  });

  describe('requestAccessToken', () => {
    it('should send request access token command to auth service', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';

      // Act & Assert
      expect(await service.requestAccessToken(userId, username)).toEqual({
        pattern: { cmd: 'auth.token.sign' },
        payload: { userId, username, type: 'access' },
      });
      expect(authClient.send).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user service throws an error', async () => {
      // Arrange
      const userId = 1;
      const username = 'username';
      const error = new RpcException('User service error');
      authClientMock.error = error;

      // Act & Assert
      await expect(
        service.requestAccessToken(userId, username),
      ).rejects.toThrow(error);
    });
  });
});
