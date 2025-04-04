import { Router } from 'expo-router';

class SharedRouter {
  private router: Router | null = null;

  setRouter(router: Router) {
    this.router = router;
  }

  getRouter() {
    if (!this.router) {
      throw new Error('Router is not set');
    }

    return this.router;
  }
}

export const sharedRouter = new SharedRouter();
