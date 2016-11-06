import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';
import _ from 'lodash/lodash';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  classNames: ['order-detail-view'],
  recognizers: 'swipe',
  classNameBindings: ['SwipeChange'],
  viewOrder : {items: {}, totalAmount: 0},
  payOrder: {items: {}, totalAmount: 0},
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

  observedOrder: function () {
    let order = this.get('order');
    let viewOrder = {items: {}, totalAmount: 0};
    let payOrder = {items: {}, totalAmount: 0};
    order.get('orderitems').forEach((orderitem)=> {
      let item = orderitem.get('item');
      let id = item.get('id');
      let extras = orderitem.get('extras');
      let isPaid = orderitem.get('isPaid');
      let forFree = orderitem.get('forFree');
      if (viewOrder.items[id+extras+isPaid+forFree] === undefined) {
        viewOrder.items[id+extras+isPaid+forFree] = {};
        viewOrder.items[id+extras+isPaid+forFree].amount = 0;
      }
      viewOrder.items[id+extras+isPaid+forFree].identifier = id+extras+isPaid+forFree;
      viewOrder.items[id+extras+isPaid+forFree].amount++;
      if(!orderitem.get('isPaid')){
        viewOrder.totalAmount += (item.get('price'));
      }
      viewOrder.items[id+extras+isPaid+forFree].isPaid = orderitem.get('isPaid');
      viewOrder.items[id+extras+isPaid+forFree].forFree = orderitem.get('forFree');
      viewOrder.items[id+extras+isPaid+forFree].prize = (item.get('price') * viewOrder.items[id+extras+isPaid+forFree].amount);
      viewOrder.items[id+extras+isPaid+forFree].categoryId = item.get('category.id');
      if(item.get('category.showAmount')){
        viewOrder.items[id+extras+isPaid+forFree].unitName = item.get('unit.name');
        viewOrder.items[id+extras+isPaid+forFree].showAmount = item.get('amount');
      }
      else{
        viewOrder.items[id+extras+isPaid+forFree].showAmount = "";
        viewOrder.items[id+extras+isPaid+forFree].unitName = "";
      }
      viewOrder.items[id+extras+isPaid+forFree].name = item.get('name');
      viewOrder.items[id+extras+isPaid+forFree].extras = extras || null;
      viewOrder.items[id+extras+isPaid+forFree].id = id;

      this.set('viewOrder', viewOrder);
    })
    this.set('payOrder', payOrder);
  }.observes('order.id','order.totalAmount'),

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
      let proms = [];
      let pay =  this.get('payOrder');
      let items = this.get('payOrder.items');
      let orderitems = this.get('order.orderitems');
      const forFreeOrder = this.get('forFree');
      for(let Item in items){
        let amount = items[Item].amount;
        orderitems.forEach((item)=>{
          let extras = item.get('extras');
          let id = item.get('item.id');
          let isPaid = item.get('isPaid');
          const forFree = item.get('forFree')
          if(amount > 0){
            if(items[Item].identifier == id+extras+isPaid+forFree){
              amount--;
              if(forFreeOrder) {
                item.set("forFree", true);
              }

              item.set("isPaid", true);
              proms.push(item.save());
            }
          }
        })
      }
      Promise.all(proms)
      .then(()=>{
        let paid = true;
        for(let order in this.get('viewOrder.items')){
          if(this.get('viewOrder.items')[order].isPaid != true){
            paid = false;
          }
        }
        let order = this.get('order');
        order.set('isPaid', paid);
        order.set('totalAmount', this.get('viewOrder.totalAmount'));
        order.save()
        .then(() => {
          this.triggerAction({action: 'triggerModal'})

          //reset forFree
          this.set('forFree', false)
        });
      })
      .catch((err) => {
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
