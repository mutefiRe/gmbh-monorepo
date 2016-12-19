import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin,{
  tagName: 'div',
  classNames: ['item-list'],
  recognizers: 'swipe',
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
    },
    goToOrderList() {
      this.get('goToOrderList')();
    },
    goToOrderOverview() {
      this.get('goToOrderOverview')();
    }
  }
});
