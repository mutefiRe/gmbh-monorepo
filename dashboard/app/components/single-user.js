import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    updateUser(user) {
      user.save();
    },
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('user') });
    }
  }
});
