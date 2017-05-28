import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  recognizers: 'swipe',
  classNames: ['order-detail','screen'],
  tagName: 'div',
  tableButtonStyle: Ember.computed('order.table', function(){
    if(typeof this.get('order.table') === "undefined"){
      return '';
    }
    return Ember.String.htmlSafe(
      'background-color: ' + this.get('order.table.area.color') + ';' +
      'color: ' + this.get('order.table.area.textcolor') + ';'
    );
  }),
  openAmount: Ember.computed('order.orderitems.@each.{countPaid,count}', function(){
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
  goToPayDetail() {
    this.get('pageTransitions').toScreen({screen: 'pay-detail', from: 'right'});
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
        if(this.get('settings.firstObject.instantPay') || this.get('user.isCashier')){
          this.goToPayDetail();
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
