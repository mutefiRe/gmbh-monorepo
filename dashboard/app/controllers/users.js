import Ember from 'ember';

export default Ember.Controller.extend({
  selectedUser: null,
  actions: {
    select(user) {
      this.set('selectedUser', user)
    }
  }
});
