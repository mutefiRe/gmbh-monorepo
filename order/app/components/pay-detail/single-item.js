import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pay-detail_single-item'],
  classNameBindings: ['css'],
  tagName: 'tr',
  computedCount: Ember.computed('orderitem.countMarked', 'orderitem.countPaid', function(){
    const orderitem = this.get('orderitem');
    switch(this.get('type')){
      case "paid":
        return orderitem.get('countPaid');
      case "marked":
        return orderitem.get('countMarked');
      case "open":
        return orderitem.get('count') - orderitem.get('countMarked') - orderitem.get('countPaid');
      default:
        return orderitem.get('count') - orderitem.get('countMarked') - orderitem.get('countPaid');
    }
  }),
  sum: Ember.computed('computedCount', function(){
    return this.get('computedCount') * this.get('orderitem.price');
  }),
  click() {
    const orderitem = this.get('orderitem');
    if (this.get('type') === "open" && orderitem.get('countMarked') < orderitem.get('count') - orderitem.get('countPaid')){
      orderitem.incrementProperty('countMarked');
    } else if (this.get('type') === "marked" && orderitem.get('countMarked') > 0) {
      orderitem.decrementProperty('countMarked');
    }
  }
});
