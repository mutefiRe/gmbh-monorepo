import Ember from 'ember';

export default Ember.Controller.extend({
  currentSelectedUser: null,
  alphabeticUserGroup: Ember.computed('model', function() {
    const users = this.get('model');
    const startingLetters = new Set();
    users.forEach(user => startingLetters.add(user.get('username').toUpperCase()[0]));
    return [...startingLetters].sort().map(letter => {
      return {
        letter,
        users: users.filter(user => user.get('username').toUpperCase()[0] === letter)
      };
    });
  })
});
