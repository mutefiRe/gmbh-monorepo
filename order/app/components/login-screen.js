import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['login-screen'],
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  router: Ember.inject.service('-routing'),

  actions: {
    authenticate() {
      const credentials = this.getProperties('identification', 'password');
      const authenticator = 'authenticator:jwt';
      const waiter = 1;

      this.get('session')
      .authenticate(authenticator, credentials)
      .then(()=> {
        if (this.get('payload.permission') === waiter) {
          this.get('router').transitionTo('order');
        } else {
          this.get('session').invalidate();
          this.get('session-payload.destory');
          throw Error('User ist nicht berechtigt');
        }
      })
      .catch(reason=> {
        if (reason) {
          this.sendAction('setErrorMessage', reason.error || reason);
        } else {
          this.sendAction('setErrorMessage', 'Server nicht erreichbar.');
        }
      });
    }
  }
});
