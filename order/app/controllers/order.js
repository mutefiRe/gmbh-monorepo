import Ember from 'ember';
import _ from 'lodash';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: false,
  modalType: 'table-select',
  modalHeadline: 'Tisch auswählen',
  order: null,
  orderItems: [],
  user: null,
  viewOrder: {
    items: {},
    totalAmount: 0
  },
  triggerModal: false,
  init() {
    let id = this.get('payload.id');
    this.store.find('user',id).then((user) => {
      this.set('user', user);
      let order = this.store.createRecord('order', {});
      order.set('user', user);
      this.set('order', order);
    });

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
      let orderItem = this.store.createRecord('orderitem', {order: this.get('order'), item: item});
      this.get('orderItems').push(orderItem);
      let viewOrder = _.cloneDeep(this.get('viewOrder'));
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
      this.get('order').removeAt(index);
    },
    showModal(activeType) {
      this.set('modalType', activeType);
      this.toggleProperty('triggerModal');
    },
    saveOrder(){
      let order = this.get('order');
      order.save().then(data => {
        for(let orderItem of this.get('orderItems')){
          orderItem.set('order', data);
          orderItem.save();
        }
      }).then(() => {this.send('resetOrder');})
    },
    resetOrder(){
      let order = this.get('order');
      this.set('orderItems', []);
      this.set('viewOrder', {items: {},totalAmount: 0});
      order.deleteRecord();
      order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);
    }
  }
});
