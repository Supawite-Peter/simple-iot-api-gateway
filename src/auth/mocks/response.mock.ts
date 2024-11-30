export class ResponseMock {
  static build() {
    return {
      cookie: jest.fn().mockReturnValue(null),
    };
  }
}
