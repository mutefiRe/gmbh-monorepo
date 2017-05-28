import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  i18n: Ember.inject.service(),
  actions: {
    save(password) {
      this.get('user').set('password', password);
      this.set('showModal', false);
    },
    cancel() {
      this.set('showModal', false);
    }
  }
});
