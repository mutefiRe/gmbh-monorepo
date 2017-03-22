import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  sortBy: ['createdAt:desc'],
  filteredOrders: Ember.computed.filter('orders', function(order){
    return order.id !== this.get('order.id');
  }),
  sortedOrders: Ember.computed.sort('filteredOrders', 'sortBy'),
  paidOrders: Ember.computed.filter('sortedOrders', function(order) {
    return !order.get('orderitems').every(unpaidItem);
  }).property('orders.@each.orderitems'),
  openOrders: Ember.computed.setDiff('sortedOrders', 'paidOrders').property('orders.@each.orderitems'),
  classNames: ['pay-main','screen'],
  filter: "orders",
  swipeLeft() {
    this.goToOrderMain();
  },
  goToOrderMain() {
    this.get('pageTransitions').toScreen({screen: 'order-main', from: 'right'});
  },
  goToPayMain() {
    this.get('pageTransitions').toScreen({screen: 'pay-detail', from: 'right'});
  },
  actions: {
    filterButtonOrder() {
      this.set('filter', "orders");
    },
    filterButtonTables() {
      this.set('filter', "tables");
    },
    backButton() {
      this.goToOrderMain();
    },
    orderClick() {
      this.goToPayMain();
    }
  }
});
function unpaidItem(orderitem) {
  return orderitem.get('countPaid') >= orderitem.get('count');
}

