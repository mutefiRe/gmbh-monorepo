import Ember from 'ember';

export default Ember.Controller.extend({
  errorMessage: null,
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),

  init() {
    if(this.get('session.isAuthenticated')){
      this.send('transitionToLogout');
    }
  },
  actions: {
    authenticate() {
      const credentials = this.getProperties('identification', 'password');
      const authenticator = 'authenticator:jwt';
      const waiter = 1;

      this.get('session')
      .authenticate(authenticator, credentials)
      .then(() => {
        if (this.get('payload').getPermission() === waiter) {
          this.send('transitionToOrder');
        } else {
          this.get('session').invalidate();
          throw Error('User ist nicht berechtigt');
        }
      })
      .catch(reason => {
        if (reason) {
          this.set('errorMessage', reason.error || reason);
        } else {
          this.set('errorMessage', 'Server nicht erreichbar.');
        }
      });
    }
  }
});
