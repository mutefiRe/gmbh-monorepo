import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  tagName: 'div',
  classNames: ['modal'],
  actions: {
    hideModal() {
      this.get('modal').hideModal(this);
    },
    changeColor(hex, name) {
      this.sendAction('action', hex, name);
      this.send('hideModal');
    }
  }
});