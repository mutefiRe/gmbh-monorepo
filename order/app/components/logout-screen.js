import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  router: Ember.inject.service('-routing'),
  classNames: ['logout-screen'],
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
