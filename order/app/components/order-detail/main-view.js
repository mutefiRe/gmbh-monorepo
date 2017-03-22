import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  classNames: ['order-detail','screen'],
  tagName: 'div',
  openAmount: Ember.computed('order.orderitems.@each.countPaid', function(){
    let total = 0;
    this.get('order.orderitems').forEach(orderitem => {
      total += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    });
    return total;
  }),
  swipeRight() {
    this.goToOrderMain();
  },
  goToOrderMain() {
    this.get('pageTransitions').toScreen({screen: 'order-main', from: 'left'});
  },
  goToOrderDetail() {
    this.get('pageTransitions').toScreen({screen: 'order-detail-view', from: 'right'});
  },
  actions: {
    returnButton(){
      this.goToOrderMain();
    },
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    },
    showModal() {
      this.get('modal')
        .showModal({ activeType: 'table-select', buttons: true });
    },
    showModal2() {
      this.get('modal')
        .showModal({ activeType: 'discard-order'});
    },
    saveOrder() {
      this.get('saveOrder')(() => {
        if(this.get('settings.firstObject.instantPay')){
          this.goToOrderDetail();
        } else {
          this.goToOrderMain();
        }
      });
    },
    removeItemFromOrder(orderitem) {
      this.get('removeItemFromOrder')(orderitem);
    }
  }
});
