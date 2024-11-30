import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/auth.service.mock';
import { ResponseMock } from './mocks/response.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let response: Response;
  process.env.COOKIE_ACCESS_TOKEN_EXP = '10m';
  process.env.COOKIE_REFRESH_TOKEN_EXP = '7d';

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
    response = ResponseMock.build() as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('[POST] /auth/login', () => {
    it('should send data to service.signIn', async () => {
      // Arrange
      const username = 'test';
      const password = 'password';

      // Act & Assert
      expect(await controller.signIn({ username, password }, response)).toEqual(
        {
          id: 1,
          username: 'test',
        },
      );
      expect(service.signIn).toHaveBeenCalledTimes(1);
      expect(response.cookie).toHaveBeenCalledTimes(2);
    });
  });
});
