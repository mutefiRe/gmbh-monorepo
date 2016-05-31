import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    createUser() {
      this.get('createUser')(
        {
          username: this.get('username'),
          firstname: this.get('firstname'),
          lastname: this.get('lastname'),
          password: this.get('password'),
          permission: this.get('permission')
        }
      );
    }
  }
});
