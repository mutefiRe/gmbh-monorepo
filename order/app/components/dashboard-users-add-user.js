import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    createUser() {
      const username = this.get('username') || null;
      const firstname = this.get('firstname') || null;
      const lastname = this.get('lastname') || null;
      const password = this.get('password') || null;
      const permission = this.get('permission') || null;

      if (username === null || firstname === null ||
        lastname === null || permission === null) {
        console.log('fail');
      } else {
        this.get('createUser')(
          {
            username: username,
            firstname: firstname,
            lastname: lastname,
            password: password,
            permission: permission
          }
        );
      }
    }
  }
});
