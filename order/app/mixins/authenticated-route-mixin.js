import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  beforeModel(transition) {
    if (this.get('session.isAuthenticated')) {
      const userPermission = this.get('payload.permission');
      const url = transition.targetName.split('.')[0];
      const admin = 0;
      const waiter = 1;

      if (url === 'dashboard' && userPermission === admin) {
        return this._super(...arguments);
      }

      if (url === 'order' && userPermission === waiter) {
        return this._super(...arguments);
      }

      transition.abort();
      if (userPermission === 0) {
        this.transitionTo('dashboard');
      } else {
        this.transitionTo('order');
      }
    } else {
      transition.abort();
      // this.set('session.attemptedTransition', transition);
      this.transitionTo('login');
    }
  }
});
