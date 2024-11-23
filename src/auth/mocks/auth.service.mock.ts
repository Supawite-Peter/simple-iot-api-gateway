export class AuthServiceMock {
  static build() {
    return {
      signIn: jest.fn().mockResolvedValue('SignIn Received'),
    };
  }
}
