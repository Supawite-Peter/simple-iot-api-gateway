export class UsersServiceMock {
  static build() {
    return {
      register: jest.fn().mockResolvedValue('register Received'),
      unregister: jest.fn().mockResolvedValue('unregister Received'),
      getUserDetails: jest.fn().mockResolvedValue('getUserDetails Received'),
      updateMqttPassword: jest
        .fn()
        .mockResolvedValue('updateMqttPassword Received'),
    };
  }
}
