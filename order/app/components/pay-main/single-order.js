import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pay-main_single-order'],
  tagName: 'tr',
  classNameBindings: ['paid'],
  openAmount: Ember.computed('order.orderitems.@each.countPaid', function () {
    let total = 0;
    this.get('order.orderitems').forEach(orderitem => {
      total += orderitem.get('price') * (orderitem.get('count') - orderitem.get('countPaid'));
    });
    return total;
  }),
  paid: Ember.computed('openAmount', function () {
    return this.get('openAmount') === 0 ? "paid" : "notpaid";
  }),
  click() {
    this.set('actualOrder', this.get('order'));
    this.get('goToOrderDetail')();
  }
});
