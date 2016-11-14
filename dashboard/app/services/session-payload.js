import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Service.extend({
  session: Ember.inject.service('session'),
  getId(){
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const authenticated = this.get('session.isAuthenticated');
    if (authenticated) {
      const token = this.get('session.session.content.authenticated.token');
      const tokenData = authenticator.getTokenData(token);

      return tokenData.id;
    }
  },
  getPermission() {
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const token = this.get('session.session.content.authenticated.token');
    const tokenData = authenticator.getTokenData(token);
    return tokenData.permission;
  }
});
