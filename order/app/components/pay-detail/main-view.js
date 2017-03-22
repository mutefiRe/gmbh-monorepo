import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend(RecognizerMixin, {
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  classNames: ['order-detail-view', 'screen'],
  recognizers: 'swipe',
  connection: true,
  type: Ember.computed('order', function () {
    return this.get('order.constructor.modelName');
  }),
  paidOrderitems: Ember.computed.filter('order.orderitems.@each.countPaid', function (orderitem) {
    if (orderitem.get('countPaid') > 0) return true;
    return false;
  }),
  markedOrderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function (orderitem) {
    if (orderitem.get('countMarked') > 0) return true;
    return false;
  }),
  orderitems: Ember.computed.filter('order.orderitems.@each.{countMarked,countPaid}', function (orderitem) {
    if (orderitem.get('countPaid') + orderitem.get('countMarked') < orderitem.get('count')) return true;
    return false;
  }),
  markedAmount: Ember.computed('markedOrderitems', function () {
    const orderitems = this.get('markedOrderitems');
    return orderitems.reduce((sum, orderitem) => sum + orderitem.get('price') * orderitem.get('countMarked'));
  }),
  openAmount: Ember.computed('order', 'order.openAmount', function () {
    return this.get('order.openAmount');
  }),
  open: Ember.computed('openAmount', function () {
    return this.get('openAmount') > 0;
  }),
  forFree: false,
  payStorage: storageFor('pay'),
  swipeRight() {
    this.goToOrderOverview();
  },
  goToOrderScreen() {
    this.get('pageTransitions').toScreen({ screen: 'order-screen', from: 'right' });
  },
  goToOrderOverview() {
    this.get('pageTransitions').toScreen({ screen: 'order-overview', from: 'left' });
  },
  actions: {
    goToOrderScreen() {
      this.goToOrderScreen();
    },
    goToOrderOverview() {
      this.goToOrderOverview();
    },
    paySelected() {
      this.get('modal').showModal({ activeType: 'loading-box' });
      this.payOrderitems();
      const orders = this.get('type') === 'table' ? this.get('order.orders') : [this.get('order')];
      this.get('connection') ? this.saveOrdersAPI(orders) : this.saveOrdersOffline(orders);
    },
    payAll() {
      this.get('modal').showModal({ activeType: 'loading-box' });
      this.payAllOrderitems();
      const orders = this.get('type') === 'table' ? this.get('order.orders') : [this.get('order')];
      this.get('connection') ? this.saveOrdersAPI(orders) : this.saveOrdersOffline(orders);
    },
    printBill() {
      this.get('printBill')(this.get('order').id);
    }
  },
  payAllOrderitems(){
    this.get('order.orderitems').forEach(orderitem => {
      orderitem.set('countPaid', orderitem.get('count'));
      if (this.get('forFree')) orderitem.set('countFree', orderitem.get('count'));
      orderitem.set('countMarked', 0);
    });
  },
  payOrderitems(){
    this.get('markedOrderitems').forEach(orderitem => {
      orderitem.set('countPaid', orderitem.get('countPaid') + orderitem.get('countMarked'));

      if (this.get('forFree')) orderitem.set('countFree', orderitem.get('countFree') + orderitem.get('countMarked'));
      orderitem.set('countMarked', 0);
    });
  },
  orderPromises(orders){
    return orders.map(order => {
      order.set('isPaid', true);
      order.set('totalAmount', 0);
      return order.save();
    });
  },
  saveOrdersOffline(orders){
    orders.forEach(order => {
      order.set('totalAmount', order.get('openAmount'));
      const serializedOrder = order.serialize();
      serializedOrder.id = order.id;
      this.get('payStorage').addObject(serializedOrder);
      this.set('forFree', false);
      this.get('modal').closeModal();
    });
  },
  saveOrdersAPI(orders){
    Promise.all(this.orderPromises(orders)).then(() => {
      this.set('forFree', false);
      this.get('modal').closeModal();
    });
  }
});
