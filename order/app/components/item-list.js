import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['item-list'],
  actions: {
    addItemToOrder(item) {
      this.get('addItemToOrder')(item);
    },
    showModal(modalType, buttons, item) {
      this.get('showModal')(modalType, buttons, item);
    }
  }
});
