import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  beforeModel() {
    if (this.get('session.isAuthenticated') === false) {
      return this.transitionTo('login');
    }
  }
});
