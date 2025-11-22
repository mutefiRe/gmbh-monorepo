import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    transitionToIndex() {
      this.transitionTo('index');
    }
  }
});
