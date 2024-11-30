import { of } from 'rxjs';

export class ClientMock {
  error: any;
  customResponse: any;

  constructor(error?: any, customResponse?: any) {
    this.error = error;
    this.customResponse = customResponse;
  }

  build() {
    return {
      send: jest.fn().mockImplementation((pattern, payload) => ({
        pipe: this.pipe.bind(this, pattern, payload),
      })),
    };
  }

  buildNoPipe() {
    return {
      send: jest
        .fn()
        .mockImplementation((pattern, payload) => this.pipe(pattern, payload)),
    };
  }

  pipe(pattern: string, payload: any) {
    if (this.error) throw this.error;
    if (this.customResponse) return of(this.customResponse);
    return of({ pattern, payload });
  }
}
