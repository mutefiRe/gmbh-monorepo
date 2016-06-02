import Ember from 'ember';
import _ from 'lodash';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: {},
  order: null,
  viewOrder: {},
  init() {
    const id = this.get('payload.id');
    this.set('order', this.store.createRecord('order', {userId: id}));

  },
  actions: {
    changeCategory(category) {
      this.set('actualCategory', category);
    },
    addItemToOrder(item) {
      let orderItem = this.store.createRecord('orderitem', {order:this.get('order'), item}).get('item').get('name');
      let viewOrder = _.cloneDeep(this.get('viewOrder'));
      if(!viewOrder[orderItem]){
        viewOrder[orderItem] = {};
        viewOrder[orderItem].amount = 1;
        viewOrder[orderItem].prize = (item.get('price')*viewOrder[orderItem].amount).toFixed(2);
      }
      else{
        viewOrder[orderItem].amount++;
        viewOrder[orderItem].prize = (item.get('price')*viewOrder[orderItem].amount).toFixed(2);
      }
      this.set('viewOrder', viewOrder)
      console.log(item.get('price'));
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    }
  }
});
