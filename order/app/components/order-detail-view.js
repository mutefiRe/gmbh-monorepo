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
  SwipeChange: function () {
    if (this.get('swipeHelper.order-detail.active') && this.get('swipeHelper.order-overview.last')) {
      return 'slide-left-in';
    } else if (this.get('swipeHelper.order-detail.last') && this.get('swipeHelper.order-overview.active')) {
      return 'slide-right-out';
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
      if (viewOrder.items[id+extras+isPaid] === undefined) {
        viewOrder.items[id+extras+isPaid] = {};
        viewOrder.items[id+extras+isPaid].amount = 0;
      }
      viewOrder.items[id+extras+isPaid].identifier = id+extras+isPaid;
      viewOrder.items[id+extras+isPaid].amount++;
      if(!orderitem.get('isPaid')){
        viewOrder.totalAmount += (item.get('price'));

      }
      viewOrder.items[id+extras+isPaid].isPaid = orderitem.get('isPaid');
      viewOrder.items[id+extras+isPaid].prize = (item.get('price') * viewOrder.items[id+extras+isPaid].amount).toFixed(2);
      viewOrder.items[id+extras+isPaid].categoryId = item.get('category.id');
      viewOrder.items[id+extras+isPaid].name = item.get('name') + " " + item.get('amount') + item.get('unit.name');
      viewOrder.items[id+extras+isPaid].extras = extras || null;
      viewOrder.items[id+extras+isPaid].id = id;

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
    goToOrderOverview() {
      this.set('swipeHelper.order-overview.active', true);
      this.set('swipeHelper.order-overview.last', false);
      this.set('swipeHelper.order-detail.active', false);
      this.set('swipeHelper.order-detail.last', true);
    },
    paySelected(){
      let pay =  this.get('payOrder');
      let items = this.get('payOrder.items');
      let orderitems = this.get('order.orderitems');
      for(let Item in items){
        let amount = items[Item].amount;
        orderitems.forEach((item)=>{
          let extras = item.get('extras');
          let id = item.get('item.id');
          let isPaid = item.get('isPaid');
          if(amount > 0){
            if(items[Item].identifier == id+extras+isPaid){
              amount--;
              item.set("isPaid", true);
              item.save();
              let order = this.get('order');
              order.set('totalAmount', pay.totalAmount);
              order.save();
            }
          }
        })
      }

    }
  }
});
