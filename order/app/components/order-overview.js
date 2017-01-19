import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  classNames: ['order-overview','screen'],
  sortProps: ['isPaid', 'createdAt:desc'],
  sortedOrders: Ember.computed.sort('orders', 'sortProps'),
  swipeLeft() {
    this.gotToOrderscreen();
  },
  gotToOrderscreen() {
    this.get('pageTransitions').toScreen({screen: 'order-screen', from: 'right'});
  },
  gotToOrderDetail() {
    this.get('pageTransitions').toScreen({screen: 'order-detail-view', from: 'right'});
  },
  actions: {
    backButton() {
      this.gotToOrderscreen();
    },
    orderClick() {
      this.gotToOrderDetail();
    }
  }
});
