import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  sessionAuthenticated() {
    const session = this.get('session.session.content');

    if (session.authenticated.token) {
      const authenticator = getOwner(this).lookup('authenticator:jwt');
      const userPermission = authenticator.getTokenData(session.authenticated.token).permission;

      switch (userPermission) {
        case 0:
          this.transitionTo('/dashboard');
          break;
        case 1:
          this.transitionTo('/order');
          break;
        default:
          this.transitionTo('/login');
          break;
      }
    }
  }
});
