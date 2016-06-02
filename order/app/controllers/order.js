import Ember from 'ember';

export default Ember.Controller.extend({
  actualCategory: {},
  order: null,
  init() {
    this.set('order', this.store.createRecord('order'));
  },
  actions: {
    changeCategory(category) {
      this.set('actualCategory', category);
    },
    addItemToOrder(item) {
      this.store.createRecord('orderitem', {order: this.get('order'), item});
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    }
  }
});
