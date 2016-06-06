import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['login-screen'],
  session: Ember.inject.service(),
  actions: {
    authenticate() {
      const credentials = this.getProperties('identification', 'password');
      const authenticator = 'authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials)
      .catch(reason=> {
        if (reason) {
          this.set('errorMessage', reason.error || reason);
        } else {
          this.set('errorMessage', 'Server nicht erreichbar.');
        }
      });
    }
  }
});
