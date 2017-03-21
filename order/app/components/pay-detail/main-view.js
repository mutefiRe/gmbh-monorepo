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
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * orderitem.get('countMarked');
    }
    return sum;
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
      const orderitems = this.get('markedOrderitems');

      for (const orderitem of orderitems) {
        orderitem.set('countPaid', orderitem.get('countPaid') + orderitem.get('countMarked'));
        if (this.get('forFree')) orderitem.set('countFree', orderitem.get('countFree') + orderitem.get('countMarked'));
        orderitem.set('countMarked', 0);
      }

      let orders;

      if (this.get('type') === 'table') {
        orders = this.get('order.orders');
      } else {
        orders = [this.get('order')];
      }

      const promises = orders.map(order => {
        order.set('totalAmount', order.get('openAmount'));
        return order.save();
      });

      Promise.all(promises).then(() => {
        this.get('modal').closeModal();
        this.set('forFree', false);
      });


      order.set('totalAmount', this.get('openAmount'));
      if (this.get('connection')) {
        const promises = orders.map(order => {
          order.set('totalAmount', order.get('openAmount'));
          return order.save();
        });

        Promise.all(promises).then(() => {
          this.get('modal').closeModal();
          this.set('forFree', false);
        });

      } else {
        for (const order of orders){
          const serializedOrder = order.serialize();
          serializedOrder.id = order.id;
          this.get('payStorage').addObject(serializedOrder);
          this.triggerAction({ action: 'triggerModal' });
          this.set('forFree', false);
        }
      }
    },

    payAll() {

      this.get('modal').showModal({ activeType: 'loading-box' });
      const orderitems = this.get('order.orderitems');
      const forFree = this.get('forFree');

      orderitems.forEach(item => {
        item.set('countPaid', item.get('count'));
        item.set('countMarked',  item.get('count'));
        item.set('countMarked', 0);
        if (forFree) item.set('countFree', item.get('count'));
      });

      let orders;

      if (this.get('type') === 'table') {
        orders = this.get('order.orders');
      } else {
        orders = [this.get('order')];
      }

      if (this.get('connection')) {
        const promises = orders.map(order => {
          order.set('isPaid', true);
          order.set('totalAmount', 0);
          return order.save();
        });

        Promise.all(promises).then(() => {
          this.get('modal').closeModal();
          this.set('forFree', false);
        });
      } else {
        for (const order of orders){
          const serializedOrder = order.serialize();
          serializedOrder.id = order.id;
          this.get('payStorage').addObject(serializedOrder);
          this.triggerAction({ action: 'triggerModal' });
          this.set('forFree', false);
        }
      }
    },
    printBill() {
      this.get('printBill')(this.get('order').id);
    }
  }
});
