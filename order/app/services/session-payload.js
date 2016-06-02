import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  id: null,
  permission: null,
  token: null,
  init() {
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const authenticated = this.get('session.isAuthenticated');

    if (authenticated) {
      const token = this.get('session.session.content.authenticated.token');
      const tokenData = authenticator.getTokenData(token);

      this.set('id', tokenData.id);
      this.set('permission', tokenData.permission);
      this.set('token', token);
    }
  }
});
