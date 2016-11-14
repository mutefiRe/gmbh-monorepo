import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    transitionToLogin() {
      this.transitionTo('login');
    }
  }
});
