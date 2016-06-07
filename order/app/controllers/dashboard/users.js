import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createUser(userObject) {
      const user = this.store.createRecord('user', userObject);

      user.save();
    }
  }
});
