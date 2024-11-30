import { IS_PUBLIC_KEY } from '../auth.public';
import { IS_REFRESH_KEY } from '../auth.refresh';

export class ReflectorMock {
  static build() {
    return {
      getAllAndOverride: jest
        .fn()
        .mockImplementation((key, context) =>
          this.getAllAndOverride(key, context),
        ),
    };
  }

  static getAllAndOverride(key: string, context: any[]) {
    if (key === IS_PUBLIC_KEY && context.includes('public')) return true;
    else if (key === IS_REFRESH_KEY && context.includes('refresh')) return true;
    return false;
  }
}
