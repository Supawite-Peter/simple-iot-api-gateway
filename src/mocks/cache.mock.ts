export class CacheMock {
  cacheData = {};

  build() {
    return {
      get: jest.fn().mockImplementation((key) => this.get(key)),
      del: jest.fn().mockImplementation((key) => this.del(key)),
      set: jest.fn().mockImplementation((key, value) => this.set(key, value)),
    };
  }

  get(key: string): Promise<unknown> {
    return this.cacheData[key] ? this.cacheData[key] : undefined;
  }

  del(key: string): Promise<void> {
    delete this.cacheData[key];
    return Promise.resolve();
  }

  set(key: string, value: any): Promise<void> {
    this.cacheData[key] = value;
    return Promise.resolve();
  }
}
