import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['preview'],
  tagName: 'ul',
  swipeLeft() {
    this.get('goToOrderDetail')();
  },
  swipeRight() {
    this.get('goToPayMain')();
  },
  click() {
    this.get('goToOrderDetail')();
  }
});
