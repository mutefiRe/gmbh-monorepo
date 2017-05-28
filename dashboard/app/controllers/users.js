import Ember from 'ember';

export default Ember.Controller.extend({
  newRecord: null,
  currentSelectedRecord: null,
  i18n: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
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
    createRecord() {
      if (!this.get('newRecord')) {
        Ember.$('body').addClass('noscroll');
        this.set('newRecord', this.get('store').createRecord('user'));
        this.set('currentSelectedRecord', {
          component: this,
          record: this.get('newRecord'),
          type:'controller'
        });
      }
    }
  }
});
