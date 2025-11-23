import Service from '@ember/service';

export default class SessionService extends Service {
  // Add properties and methods as needed for authentication/session
  isAuthenticated = false;
  session = {
    content: {
      authenticated: {
        token: null
      }
    }
  };

  authenticate(token) {
    this.isAuthenticated = true;
    this.session.content.authenticated.token = token;
  }

  invalidate() {
    this.isAuthenticated = false;
    this.session.content.authenticated.token = null;
  }
}
