import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ClientMock } from '../mocks/client.mock';

describe('AuthService', () => {
  let userClientMock: ClientMock;
  let service: AuthService;

  beforeEach(async () => {
    userClientMock = new ClientMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_SERVICE',
          useValue: userClientMock.build(),
        },
      ],
    }).compile();

    service = module.get(AuthService);
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
});
