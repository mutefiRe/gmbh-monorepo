import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['item-list'],
  swipeLeft() {
    this.get('goToOrderList')();
  },
  swipeRight() {
    this.get('goToOrderOverview')();
  },
  actions: {
    addItemToOrder(item) {
      this.get('addItemToOrder')(item);
    },
    showModal(modalType, buttons, item) {
      this.get('showModal')(modalType, buttons, item);
    }
  }
});
