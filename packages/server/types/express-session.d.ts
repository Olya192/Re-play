import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string | number;
      name: string;
      email: string;
      avatar?: string | null;
      login?: string;
    };
  }
}
