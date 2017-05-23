import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    updateUser(user) {
      user.save().then(() => {
        this.send('toggleEditable');
      }).catch(() => {
        console.log('Error');
      });
    },
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('user') });
    }
  }
});
