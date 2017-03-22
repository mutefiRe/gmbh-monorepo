import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-detail_single-item'],
  tagName: 'tr',
  isTabbed: false,
  click(){
    if(this.get('isTabbed')){
      this.set('isTabbed',false);
    }
    else{
      this.set('isTabbed',true);
    }
  },
  actions: {
    deleteOrderItem() {
      this.get('deleteOrderItem')(this.get('index'));
    },
    removeItemFromOrder(){
      this.get('removeItemFromOrder')(this.get('orderitem'));
    }
  }
});
