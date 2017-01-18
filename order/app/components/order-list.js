import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['orderlist'],
  tagName: 'div',
  openAmount: Ember.computed('order.orderitems.@each.countPaid', function(){
    let total = 0;
    this.get('order.orderitems').forEach(orderitem => {
      total += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'))
    })
    return total;
  }),
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if(this.get('settings.firstObject.instantPay')){
      if (this.get('swipeHelper.order-list.active') && this.get('swipeHelper.order-screen.last')) {
        return 'slide-left-in';
      } else if (this.get('swipeHelper.order-list.last') && this.get('swipeHelper.order-detail.active')) {
        return 'slide-left-out';
      }
    } else {
      if (this.get('swipeHelper.order-list.active') && this.get('swipeHelper.order-screen.last')) {
        return 'slide-left-in';
      } else if (this.get('swipeHelper.order-list.last') && this.get('swipeHelper.order-screen.active')) {
        return 'slide-right-out';
      }
    }

    return 'none';
  }.property('swipeHelper.order-list.active'),
  modalSwipeTrigger: function () {
    this.triggerAction({
      action: 'goToOrderScreen',
      target: this
    });
  }.observes('triggerOrderListSwipe'),
  swipeRight() {
    this.triggerAction({
      action: 'goToOrderScreen',
      target: this
    });
  },
  actions: {
    goToOrderScreen() {
      this.set('swipeHelper.order-screen.active', true);
      this.set('swipeHelper.order-screen.last', false);
      this.set('swipeHelper.order-list.active', false);
      this.set('swipeHelper.order-list.last', true);
      this.set('swipeHelper.order-detail.last', false);
    },
    gotToOrderDetail() {
      this.set('swipeHelper.order-detail.active', true);
      this.set('swipeHelper.order-detail.last', false);
      this.set('swipeHelper.order-list.active', false);
      this.set('swipeHelper.order-list.last', true);
      this.set('swipeHelper.order-screen.last', false);
    },
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    },
    showModal() {
      this.get('showModal')('table-select', true);
    },
    showModal2() {
      this.get('showModal')('discard-order', true);
    },
    saveOrder() {
      this.get('saveOrder')(() => {
        if(this.get('settings.firstObject.instantPay')){
          this.triggerAction({
            action: 'gotToOrderDetail',
            target: this
          });
        } else {
          this.triggerAction({
            action: 'goToOrderScreen',
            target: this
          });
        }
      })
    },
    removeItemFromOrder(orderitem) {
      this.get('removeItemFromOrder')(orderitem);
    }
  }
});
