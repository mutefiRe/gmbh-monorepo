import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  actions: {
    saveUser(user) {
      this.store.findRecord('user', user.id).then(function(updatedUser) {
        updatedUser.set('firstname', user.firstname);
      });
    }
  }
});
