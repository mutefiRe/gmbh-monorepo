import Ember from 'ember';
import _ from 'lodash';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: false,
  modalType: 'table-select',
  order: null,
  viewOrder: {},
  totalAmount: 0,
  init() {
    const id = this.get('payload.id');

    this.set('order', this.store.createRecord('order', {userId: id}));
  },
  modalWidget: function () {
    return this.get('modalType');
  }.property('model.modalType'),
  actions: {
    changeCategory(category) {
      if (this.get('actualCategory') === category) {
        this.set('actualCategory', false);
      } else {
        this.set('actualCategory', category);
      }
    },
    addItemToOrder(item) {
      const orderItem = this.store.createRecord('orderitem', {order: this.get('order'), item}).get('item').get('name');
      const viewOrder = _.cloneDeep(this.get('viewOrder'));
      let totalAmount = _.cloneDeep(this.get('totalAmount'));

      if (!viewOrder[orderItem]) {
        viewOrder[orderItem] = {};
        viewOrder[orderItem].amount = 1;
      } else {
        viewOrder[orderItem].amount++;
      }
      viewOrder[orderItem].prize = (item.get('price') * viewOrder[orderItem].amount).toFixed(2);
      viewOrder[orderItem].categoryId = item.get('category').get('id');
      totalAmount += (item.get('price') * viewOrder[orderItem].amount);
      this.set('viewOrder', viewOrder);
      this.set('totalAmount', totalAmount);
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    }
  }
});
