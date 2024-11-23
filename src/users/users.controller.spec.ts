import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersServiceMock } from './mocks/users.service.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        switch (token) {
          case UsersService:
            return UsersServiceMock.build();
        }
      })
      .compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('[POST] /users/register', () => {
    it('should send data to service.register', async () => {
      // Act & Assert
      expect(
        await controller.register({
          username: 'user',
          password: 'pass',
        }),
      ).toEqual('register Received');
      expect(service.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('[DELETE] /users/unregister', () => {
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
          {
            password: 'pass',
          },
        ),
      ).toEqual('unregister Received');
      expect(service.unregister).toHaveBeenCalledTimes(1);
    });
  });
});
