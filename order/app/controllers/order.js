import Ember from 'ember';

export default Ember.Controller.extend({
  actualCategory: {},
  orders: [],
  actions: {
    changeCategory(category) {
      this.set('actualCategory', category);
    },
    addItemToOrder(item) {
      this.get('orders').pushObject(item);
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    }
  }
});
