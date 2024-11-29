export class DevicesServiceMock {
  static build() {
    return {
      register: jest.fn().mockResolvedValue('register Received'),
      unregister: jest.fn().mockResolvedValue('unregister Received'),
      getDevicesList: jest.fn().mockResolvedValue('getDevicesList Received'),
      addDeviceTopics: jest.fn().mockResolvedValue('addDeviceTopics Received'),
      getDeviceDetails: jest
        .fn()
        .mockResolvedValue('getDeviceDetails Received'),
      removeDeviceTopics: jest
        .fn()
        .mockResolvedValue('removeDeviceTopics Received'),
    };
  }
}
