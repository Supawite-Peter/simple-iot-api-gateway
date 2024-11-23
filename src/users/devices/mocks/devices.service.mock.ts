export class DevicesServiceMock {
  static build() {
    return {
      register: jest.fn().mockResolvedValue('register Received'),
      unregister: jest.fn().mockResolvedValue('unregister Received'),
      getDevicesList: jest.fn().mockResolvedValue('getDevicesList Received'),
      addDeviceTopics: jest.fn().mockResolvedValue('addDeviceTopics Received'),
      removeDeviceTopics: jest
        .fn()
        .mockResolvedValue('removeDeviceTopics Received'),
    };
  }
}
