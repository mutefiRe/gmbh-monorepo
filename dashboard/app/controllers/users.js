import Ember from 'ember';

export default Ember.Controller.extend({
  editable: Ember.inject.service(),
  newUser: null,
  currentSelectedUser: null,
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
      Ember.$('body').addClass('noscroll');
      this.set('newUser', this.get('store').createRecord('user'));
      this.get('currentSelectedUser').set('record', this.get('newUser'));
    },
    saveNewUser() {
      this.get('newUser').save().then(() => {
        this.set('newUser', null);
        this.get('currentSelectedUser').set('record', null);
        Ember.$('body').removeClass('noscroll');
      });
    }
  }
});
