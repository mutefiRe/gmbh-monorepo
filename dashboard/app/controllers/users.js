import Ember from 'ember';

export default Ember.Controller.extend({
  editable: Ember.inject.service(),
  currentUser: null,
  alphabeticUserGroup: Ember.computed('model.@each.{username,id}', function() {
    const users = this.get('model').filter(user => user.get('username'));
    const startingLetters = new Set();
    users.forEach(user => startingLetters.add(user.get('username').toUpperCase()[0]));
    return [...startingLetters].sort().map(letter => {
      return {
        letter,
        users: users.filter(user => user.get('username').toUpperCase()[0] === letter)
      };
    });
  }),
  actions: {
    createUser() {
      this.set('currentUser', this.get('store').createRecord('user'));
    },
    saveCurrentUser() {
      this.get('currentUser').save().then(() => {
        this.set('currentUser', null);
      });
    }
  }
});
