import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  classNames: ['orderlist','screen'],
  tagName: 'div',
  swipeRight() {
    this.goToOrderScreen();
  },
  goToOrderScreen() {
    this.get('pageTransitions').toScreen({screen: 'order-screen', from: 'left'});
  },
  gotToOrderDetail() {
    this.get('pageTransitions').toScreen({screen: 'order-detail-view', from: 'right'});
  },
  actions: {
    returnButton(){
      this.goToOrderScreen();
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
          this.gotToOrderDetail();
        } else {
          this.goToOrderScreen();
        }
      });
    },
    removeItemFromOrder(orderitem) {
      this.get('removeItemFromOrder')(orderitem);
    }
  }
});
