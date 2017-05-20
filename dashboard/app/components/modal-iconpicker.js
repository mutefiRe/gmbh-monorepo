import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  tagName: 'div',
  classNames: ['modal'],
  actions: {
    hideModal() {
      this.get('modal').hideModal(this);
    },
    changeIcon(type, name) {
      this.sendAction('action', type, name);
      this.send('hideModal');
    }
  }
});