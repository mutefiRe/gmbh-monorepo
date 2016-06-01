import Ember from 'ember';
const {store} = Ember.inject;

export default Ember.Controller.extend({
  actualCategory: {},
  order: null,
  init(){
    this.set('order', this.store.createRecord('order'))
  },
  actions: {
    changeCategory(category) {
      this.set('actualCategory', category);
    },
    addItemToOrder(item) {
      this.store.createRecord('orderitem', {order:this.get('order')})
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    }
  }
});
