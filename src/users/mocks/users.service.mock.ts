export class UsersServiceMock {
  static build() {
    return {
      register: jest.fn().mockResolvedValue('register Received'),
      unregister: jest.fn().mockResolvedValue('unregister Received'),
    };
  }
}
