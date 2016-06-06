import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['item-list'],
  swipeLeft() {
    this.set('swipeHelper.order-list.active', true);
    this.set('swipeHelper.order-list.last', false);
    this.set('swipeHelper.order-screen.active', false);
    this.set('swipeHelper.order-screen.last', true);
    console.log('swipe left');
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
