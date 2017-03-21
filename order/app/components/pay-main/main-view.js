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
  classNames: ['order-overview','screen'],
  filter: "orders",
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
    filterButtonOrder() {
      this.set('filter', "orders");
    },
    filterButtonTables() {
      this.set('filter', "tables");
    },
    backButton() {
      this.gotToOrderscreen();
    },
    orderClick() {
      this.gotToOrderDetail();
    }
  }
});

<<<<<<< HEAD
function unpaidItem(orderitem) {
  return orderitem.get('countPaid') >= orderitem.get('count');
}
=======
function unpaidItem(item) {
  return item.get('countPaid') < item.get('count');
}
>>>>>>> develop
