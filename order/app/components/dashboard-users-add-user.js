/* eslint complexity: ["error", 14] */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  // error: {
  //   username: '',
  //   firstname: '',
  //   lastname: '',
  //   permission: ''
  // },
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
    },
    toggleButton() {
      const username = this.get('username') || '';
      const firstname = this.get('firstname') || '';
      const lastname = this.get('lastname') || '';
      const permission = this.get('permission') || '';

      if (username && firstname && lastname && permission) {
        this.toggleProperty('toggle');
      } else {
        this.set('toggle', true);
      }
    }
  }
});
