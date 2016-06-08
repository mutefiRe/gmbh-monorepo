import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-overview-item'],
  tagName: 'tr',
  classNameBindings: ['paid'],
  paid: function(){
    if(this.get('order.isPaid')){
      return "paid";
    }
    return "notpaid";
  }.property('order.isPaid'),
  click(){
    this.set('actualOrder', this.get('order'));
    this.triggerAction({
      action: 'gotToOrderDetail',
      target: this
    });
  },
  init(){
    this._super();
  },
  actions: {
    gotToOrderDetail() {
      this.get('gotToOrderDetail')();
    }
  }
});
