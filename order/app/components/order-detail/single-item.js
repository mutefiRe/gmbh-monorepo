import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-detail_single-item'],
  tagName: 'tr',
  isTabbed: false,
  click(){
    this.set('isTabbed', true);
  },
  actions: {
    deleteOrderItem() {
      this.get('deleteOrderItem')(this.get('index'));
    },
    closeTabbed() {
      this.set('isTabbed', false);
    },
    removeItemFromOrder(){
      this.get('removeItemFromOrder')(this.get('orderitem'));
    },
    reduceOrderitemCount(){
      const count = this.get('orderitem.count');
      if(count > 1){
        this.set('orderitem.count', this.get('orderitem.count') - 1);
      }else{
        this.send('removeItemFromOrder');
      }
    }
  }
});
