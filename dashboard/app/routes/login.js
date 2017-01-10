import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    transitionToDashboard() {
      this.transitionTo('dashboard');
    }
  }
});
