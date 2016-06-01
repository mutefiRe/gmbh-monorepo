import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
const {service} = Ember.inject;

export default Ember.Mixin.create({
  session: service('session'),
  beforeModel(transition) {
    if (this.get('session.isAuthenticated')) {

      const session = this.get('session.session.content');
      const token = session.authenticated.token;
      const authenticator = getOwner(this).lookup('authenticator:jwt');
      const userPermission = authenticator.getTokenData(token).permission;
      const url = transition.targetName.split('.')[0];
      const admin = 0;
      const waiter = 1;

      if (url === 'dashboard' && userPermission === admin) {
        return this._super(...arguments);
      }

      if (url === 'oder' && userPermission === waiter) {
        return this._super(...arguments);
      }


      transition.abort();

      if (url === 'order') {
        this.transitionTo('dashboard');
      } else {
        this.transitionTo('order');
      }
    } else {
      transition.abort();
      this.set('session.attemptedTransition', transition);
      this.transitionTo('login');
    }
  }
});
