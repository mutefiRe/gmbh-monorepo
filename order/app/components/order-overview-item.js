import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-overview-item'],
  tagName: 'tr',
  classNameBindings: ['bezahlt'],
  init(){
    this._super();
    if(this.get('order.isPaid')){
      this.get('classNames').push("paid");
    }
    else{
      this.get('classNames').push("notpaid");
    }
  },
  actions: {

  }
});
