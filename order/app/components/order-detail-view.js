import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  classNames:        ['order-detail-view'],
  recognizers:       'swipe',
  classNameBindings: ['SwipeChange'],
  paidOrderitems: Ember.computed.filter('order.orderitems', function(orderitem) {
    if (orderitem.get('countPaid') > 0) return true;
    return false;
  }),
  markedOrderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function(orderitem) {
    if (orderitem.get('countMarked') > 0) return true;
    return false;
  }),
  orderitems: Ember.computed.filter('order.orderitems.@each.countMarked', function(orderitem) {
    console.log(orderitem.get('countPaid') + orderitem.get('countMarked') < orderitem.get('count'))
    if (orderitem.get('countPaid') + orderitem.get('countMarked') < orderitem.get('count')) return true;
    return false;
  }),
  markedAmount: Ember.computed('markedOrderitems', function(){
    let orderitems = this.get('markedOrderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * orderitem.get('countMarked');
    }
    return sum;
  }),
  openAmount: Ember.computed('orderitems', function(){
    let orderitems = this.get('orderitems');
    let sum = 0;
    for (const orderitem of orderitems) {
      sum += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    }
    return sum;
  }),
  forFree: false,
  SwipeChange: function () {
    if(this.get('settings.firstObject.instantPay')){
      if (this.get('swipeHelper.order-detail.active') && this.get('swipeHelper.order-list.last')) {
        return 'slide-left-in';
      }
    } else {
      if (this.get('swipeHelper.order-detail.last') && this.get('swipeHelper.order-overview.active')) {
        return 'slide-right-out';
      }
    }
    if (this.get('swipeHelper.order-detail.active') && this.get('swipeHelper.order-overview.last')) {
      return 'slide-left-in';
    }
    return 'none';
  }.property('swipeHelper.order-detail.active'),

  swipeRight() {
    this.triggerAction({
      action: 'goToOrderOverview',
      target: this
    });
  },
  actions: {
    goToOrderScreen() {
      this.set('swipeHelper.order-screen.active', true);
      this.set('swipeHelper.order-screen.last', false);
      this.set('swipeHelper.order-detail.active', false);
      this.set('swipeHelper.order-detail.last', true);
    },
    goToOrderOverview() {
      this.set('swipeHelper.order-overview.active', true);
      this.set('swipeHelper.order-overview.last', false);
      this.set('swipeHelper.order-detail.active', false);
      this.set('swipeHelper.order-detail.last', true);
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
        promises.push(orderitem.save());
      }
      Promise.all(promises)
      .then(() => {

        let order = this.get('order');
        let items = order.get('orderitems');

        order.set('isPaid', this.get('openAmount') == 0 ? true : false);
        order.set('totalAmount', this.get('openAmount'));
        return order.save();
      }).then(() => {
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
