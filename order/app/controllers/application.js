import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  currentUser: Ember.computed('session.session.content', function () {
    const authenticator = getOwner(this).lookup('authenticator:jwt');
    const session = this.get('session.session.content');

    if (session && session.authenticated.token) {
      const tokenData = authenticator.getTokenData(session.authenticated.token);

      if (tokenData.id) {
        return this.store.findRecord('user', tokenData.id);
      }
    }

    return false;

  }),
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});

