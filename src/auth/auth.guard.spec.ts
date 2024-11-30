import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { createMock } from '@golevelup/ts-jest';
import { AuthGuard } from './auth.guard';
import { ClientMock } from '../mocks/client.mock';
import { ReflectorMock } from './mocks/reflector.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtClientMock: ClientMock;

  beforeEach(async () => {
    jwtClientMock = new ClientMock();
    guard = new AuthGuard(
      jwtClientMock.buildNoPipe() as unknown as ClientProxy,
      ReflectorMock.build() as unknown as Reflector,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if metadata IS_PUBLIC_KEY is exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      getHandler: () => 'public' as any,
    });

    // Act & Assert
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should validate refresh token if metadata IS_REFRESH_KEY is exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      getHandler: () => 'refresh' as any,
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { refreshToken: 'refreshToken' },
        }),
      }),
    });

    // Act & Assert
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should validate access token context if metadata IS_REFRESH_KEY and IS_PUBLIC_KEY is not exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { accessToken: 'accessToken' },
        }),
      }),
    });

    // Act & Assert
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw unauthorized exception if refresh token is not exist when metadata IS_REFRESH_KEY is exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      getHandler: () => 'refresh' as any,
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { accessToken: 'accessToken' },
        }),
      }),
    });

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('No token provided for refreshToken'),
    );
  });

  it('should throw unauthorized exception if access token is not exist when metadata IS_REFRESH_KEY and IS_PUBLIC_KEY is not exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { normalToken: 'normalToken' },
        }),
      }),
    });

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('No token provided for accessToken'),
    );
  });

  it('should throw unauthorized exception if validation for refresh token is failed when metadata IS_REFRESH_KEY is exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      getHandler: () => 'refresh' as any,
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { refreshToken: 'refreshToken' },
        }),
      }),
    });
    jwtClientMock.error = new Error();

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Validation failed for refreshToken'),
    );
  });

  it('should throw unauthorized exception if validation for access token is failed when metadata IS_REFRESH_KEY and IS_PUBLIC_KEY is not exist', async () => {
    // Arrange
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { accessToken: 'accessToken' },
        }),
      }),
    });
    jwtClientMock.error = new Error();

    // Act & Assert
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Validation failed for accessToken'),
    );
  });
});
