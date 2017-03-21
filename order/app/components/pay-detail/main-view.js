import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Component.extend(RecognizerMixin, {
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  classNames: ['order-detail-view', 'screen'],
  recognizers: 'swipe',
<<<<<<< HEAD
  connection: true,
=======
  type: Ember.computed('order', function () {
    return this.get('order.constructor.modelName');
  }),
>>>>>>> develop
  paidOrderitems: Ember.computed.filter('order.orderitems.@each.countPaid', function (orderitem) {
    if (orderitem.get('countPaid') > 0) return true;
    return false;
  }),
  markedOrderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function (orderitem) {
    if (orderitem.get('countMarked') > 0) return true;
    return false;
  }),
<<<<<<< HEAD
  orderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function (orderitem) {
=======
  orderitems: Ember.computed.filter('order.orderitems.@each.{countMarked,countPaid}', function (orderitem) {
>>>>>>> develop
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
<<<<<<< HEAD
  openAmount: Ember.computed('orderitems', function () {
    const orderitems = this.get('orderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
=======
  openAmount: Ember.computed('order', 'order.openAmount', function () {
    return this.get('order.openAmount');
>>>>>>> develop
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
<<<<<<< HEAD
      this.triggerAction({ action: 'showLoadingModal' });
      const orderitems = this.get('markedOrderitems');

=======
      this.get('modal').showModal({ activeType: 'loading-box' });
      const orderitems = this.get('markedOrderitems');
      const forFreeOrder = this.get('forFree');
>>>>>>> develop
      for (const orderitem of orderitems) {
        orderitem.set('countPaid', orderitem.get('countPaid') + orderitem.get('countMarked'));
        if (this.get('forFree')) orderitem.set('countFree', orderitem.get('countFree') + orderitem.get('countMarked'));
        orderitem.set('countMarked', 0);
      }

<<<<<<< HEAD
      const order = this.get('order');

      order.set('totalAmount', this.get('openAmount'));
      if (this.get('connection')) {
        order.save().then(() => {
          this.triggerAction({ action: 'triggerModal' });
          this.set('forFree', false);
        }).catch(() => {
          this.get('order.orderitems').forEach(item => {
            item.rollbackAttributes();
          });
          this.get('order').rollbackAttributes();
        });
      } else {
        const serializedOrder = order.serialize();
        serializedOrder.id = order.id;
        this.get('payStorage').addObject(serializedOrder);
        this.triggerAction({ action: 'triggerModal' });
        this.set('forFree', false);
      }
=======
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
>>>>>>> develop
    },

    payAll() {
<<<<<<< HEAD
      this.triggerAction({ action: 'showLoadingModal' });
=======
      this.get('modal').showModal({ activeType: 'loading-box' });
>>>>>>> develop
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

<<<<<<< HEAD
      order.set('isPaid', true);
      order.set('totalAmount', 0);

      if (this.get('connection')) {
        order.save().then(() => {
          this.triggerAction({ action: 'triggerModal' });
          this.set('forFree', false);
        }).catch(() => {
          this.get('order.orderitems').forEach(item => {
            item.rollbackAttributes();
          });
          this.get('order').rollbackAttributes();
        });
      } else {
        const serializedOrder = order.serialize();
        serializedOrder.id = order.id;
        this.get('payStorage').addObject(serializedOrder);
        this.triggerAction({ action: 'triggerModal' });
        this.set('forFree', false);
      }
    },
    printBill() {
      this.triggerAction({ action: 'showLoadingModal' });
=======
      const promises = orders.map(order => {
        order.set('isPaid', true);
        order.set('totalAmount', 0);
        return order.save();
      });

      Promise.all(promises).then(() => {
        this.get('modal').closeModal();
        this.set('forFree', false);
      });

    },
    printBill() {
>>>>>>> develop
      this.get('printBill')(this.get('order').id);
    }
  }
});
