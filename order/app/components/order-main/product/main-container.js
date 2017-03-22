import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin,{
  tagName: 'div',
  classNames: ['product'],
  recognizers: 'swipe',
  swipeLeft() {
    this.get('goToOrderDetail')();
  },
  swipeRight() {
    this.get('goToPayMain')();
  },
  actions: {
    addItemToOrder(item) {
      this.get('addItemToOrder')(item);
    },
    showModal(modalType, buttons, item) {
      this.get('showModal')(modalType, buttons, item);
    },
    goToOrderDetail() {
      this.get('goToOrderDetail')();
    },
    goToPayMain() {
      this.get('goToPayMain')();
    }
  }
});
