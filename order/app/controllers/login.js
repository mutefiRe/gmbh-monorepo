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

      this.get('session')
        .authenticate(authenticator, credentials)
        .then(() => {
          this.send('transitionToOrder');
        })
        .catch(reason => {
          if (reason) {
            this.get('notifications').error(reason, { autoClear: true });
          } else {
            this.get('notifications').error(this.get('i18n').t('notification.login.failed'), { autoClear: true });
          }
        });
    }
  }
});
