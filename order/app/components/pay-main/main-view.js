import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  sortBy: ['createdAt:desc'],
  sortedOrders: Ember.computed.sort('orders', 'sortBy'),
  openOrders: Ember.computed.filter('sortedOrders', order => {
    return order.get('orderitems').every(unpaidItem);
  }).property('orders.@each.orderitems'),
  paidOrders: Ember.computed.setDiff('sortedOrders', 'openOrders').property('orders.@each.orderitems'),
  classNames: ['pay-main','screen'],
  filter: "orders",
  swipeLeft() {
    this.goToOrderscreen();
  },
  goToOrderscreen() {
    this.get('pageTransitions').toScreen({screen: 'order-screen', from: 'right'});
  },
  goToOrderDetail() {
    this.get('pageTransitions').toScreen({screen: 'order-detail-view', from: 'right'});
  },
  actions: {
    filterButtonOrder() {
      this.set('filter', "orders");
    },
    filterButtonTables() {
      this.set('filter', "tables");
    },
    backButton() {
      this.goToOrderscreen();
    },
    orderClick() {
      this.goToOrderDetail();
    }
  }
});

function unpaidItem(item) {
  return item.get('countPaid') < item.get('count');
}
