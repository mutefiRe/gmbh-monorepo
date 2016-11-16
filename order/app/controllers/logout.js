import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  init() {
    if(!this.get('session.isAuthenticated')){
      this.send('transitionToLogin');
    }
  },
  actions: {
    logout() {
      this.get('session')
      .invalidate()
      .then(() => {
        this.send('transitionToLogin');
      });
    }
  }
});
