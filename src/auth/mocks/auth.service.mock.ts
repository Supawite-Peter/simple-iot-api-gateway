export class AuthServiceMock {
  static build() {
    return {
      signIn: jest.fn().mockResolvedValue({
        user: { sub: 1, username: 'test' },
        token: { accessToken: 'accessToken', refreshToken: 'refreshToken' },
      }),
    };
  }
}
