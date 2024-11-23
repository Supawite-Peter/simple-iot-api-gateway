import { of } from 'rxjs';

export class ClientMock {
  error: any;

  constructor(error?: any) {
    this.error = error;
  }

  build() {
    return {
      send: jest.fn().mockImplementation((pattern, payload) => ({
        pipe: this.pipe.bind(this, pattern, payload),
      })),
    };
  }

  pipe(pattern: string, payload: any) {
    if (this.error) throw this.error;
    return of({ pattern, payload });
  }
}
