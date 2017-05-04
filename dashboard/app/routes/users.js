import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('user').then(users => {
      const startingLetters = new Set();
      users.forEach(user => startingLetters.add(user.get('username').toUpperCase()[0]));
      return [...startingLetters].sort().map(letter => {
        return {
          letter,
          data: users.filter(user => user.get('username').toUpperCase()[0] === letter)
        };
      });
    });
  }
});
