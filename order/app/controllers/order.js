import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: {},
  modalType: 'table-select',
  order: null,
  init() {
    const id = this.get('payload.id');

    this.set('order', this.store.createRecord('order', {userId: id}));
  },
  modalWidget: function () {
    return this.get('modalType');
  }.property('model.modalType'),
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
