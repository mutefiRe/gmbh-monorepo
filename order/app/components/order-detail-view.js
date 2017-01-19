import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  pageTransitions: Ember.inject.service('pagetransitions'),
  classNames:        ['order-detail-view','screen'],
  recognizers:       'swipe',
  paidOrderitems: Ember.computed.filter('order.orderitems', function(orderitem) {
    if (orderitem.get('countPaid') > 0) return true;
    return false;
  }),
  markedOrderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function(orderitem) {
    if (orderitem.get('countMarked') > 0) return true;
    return false;
  }),
  orderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function(orderitem) {
    if (orderitem.get('countPaid') + orderitem.get('countMarked') < orderitem.get('count')) return true;
    return false;
  }),
  markedAmount: Ember.computed('markedOrderitems', function(){
    const orderitems = this.get('markedOrderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * orderitem.get('countMarked');
    }
    return sum;
  }),
  openAmount: Ember.computed('orderitems', function(){
    const orderitems = this.get('orderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
  }),
  forFree: false,
  swipeRight() {
    this.goToOrderOverview();
  },
  goToOrderScreen() {
    this.get('pageTransitions').toScreen({screen: 'order-screen', from: 'right'});
  },
  goToOrderOverview() {
    this.get('pageTransitions').toScreen({screen: 'order-overview', from: 'left'});
  },
  actions: {
    goToOrderScreen() {
      this.goToOrderScreen();
    },
    goToOrderOverview() {
      this.goToOrderOverview();
    },
    paySelected(){
      this.triggerAction({action: 'showLoadingModal'})
      const orderitems = this.get('markedOrderitems');
      const forFreeOrder = this.get('forFree');
      let promises = []
      for(let orderitem of orderitems){
        orderitem.set('countPaid', orderitem.get('countPaid') + orderitem.get('countMarked'));
        if (forFreeOrder) orderitem.set('countFree', orderitem.get('countFree') + orderitem.get('countMarked'));
        orderitem.set('countMarked', 0);
      }

      let order = this.get('order');
      let items = order.get('orderitems');

      order.set('isPaid', this.get('openAmount') == 0 ? true : false);
      order.set('totalAmount', this.get('openAmount'));
      order.save().then(() => {
        this.triggerAction({action: 'triggerModal'})
        this.set('forFree', false)
      }).catch((err) => {
        this.get('order.orderitems').forEach((item) => {
          item.rollbackAttributes();
        })
        this.get('order').rollbackAttributes();
      });
    },
    payAll() {
      this.triggerAction({action: 'showLoadingModal'});
      const orderitems = this.get('order.orderitems');
      const forFree = this.get('forFree');

      orderitems.forEach(item => {
        item.set('countPaid', item.get('count'));
        if (forFree) item.set('countFree', item.get('count'));
      });

      const order = this.get('order');

      order.set('isPaid', true);
      order.set('totalAmount', 0);
      order.save().then(() => {
        this.triggerAction({action: 'triggerModal'});
        this.set('forFree', false);
      }).catch(() => {
        this.get('order.orderitems').forEach(item => {
          item.rollbackAttributes();
        });
        this.get('order').rollbackAttributes();
      });
    },
    printBill() {
      this.triggerAction({action: 'showLoadingModal'});
      this.get('printBill')(this.get('order').id);
    }
  }
});
