import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/auth.service.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        switch (token) {
          case AuthService:
            return AuthServiceMock.build();
        }
      })
      .compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('[POST] /auth/login', () => {
    it('should send data to service.signIn', async () => {
      // Arrange
      const username = 'username';
      const password = 'password';

      // Act & Assert
      expect(await controller.signIn({ username, password })).toEqual(
        'SignIn Received',
      );
      expect(service.signIn).toHaveBeenCalledTimes(1);
    });
  });
});
