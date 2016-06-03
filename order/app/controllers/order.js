import Ember from 'ember';
import _ from 'lodash';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: false,
  modalType: 'table-select',
  modalHeadline: 'Tisch auswählen',
  order: null,
  viewOrder: {
    items: {},
    totalAmount: 0
  },
  triggerModal: false,
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
      const orderItem = this.store.createRecord('orderitem', {order: this.get('order'), item});
      const viewOrder = _.cloneDeep(this.get('viewOrder'));
      if (viewOrder.items[item.get('id')+orderItem.get('extras')] === undefined) {
        viewOrder.items[item.get('id')+orderItem.get('extras')] = {};
        viewOrder.items[item.get('id')+orderItem.get('extras')].amount = 0;

      }
      viewOrder.items[item.get('id')+orderItem.get('extras')].amount++;
      viewOrder.items[item.get('id')+orderItem.get('extras')].prize = (item.get('price') * viewOrder.items[item.get('id')+orderItem.get('extras')].amount).toFixed(2);
      viewOrder.items[item.get('id')+orderItem.get('extras')].categoryId = item.get('category').get('id');
      viewOrder.items[item.get('id')+orderItem.get('extras')].name = item.get('name') + " " + item.get('amount') + item.get('unit').get('name');
      viewOrder.items[item.get('id')+orderItem.get('extras')].extras = orderItem.get('extras');
      viewOrder.totalAmount += (item.get('price') * viewOrder.items[item.get('id')+orderItem.get('extras')].amount);
      this.set('viewOrder', viewOrder);
    },
    deleteOrderItem(index) {
      this.get('orders').removeAt(index);
    },
    showModal(activeType) {
      this.set('modalType', activeType);
      this.toggleProperty('triggerModal');
    }
  }
});
