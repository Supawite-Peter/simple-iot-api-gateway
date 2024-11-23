export class SensorsDataServiceMock {
  static build() {
    return {
      updateValue: jest.fn().mockResolvedValue('updateValue Received'),
      getLatestData: jest.fn().mockResolvedValue('getLatestData Received'),
      getPeriodicData: jest.fn().mockResolvedValue('getPeriodicData Received'),
    };
  }
}
