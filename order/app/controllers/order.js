import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  actualCategory: false,
  swipeHelper: {
    'order-overview': {active: false, last: false},
    'order-screen': {active: true, last: false},
    'order-list': {active: false, last: true}
  },
  modalType: 'table-select',
  modalHeadline: 'Tisch auswählen',
  modalButtons: true,
  order: null,
  modalItem: null,
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
  actions: {
    changeCategory(category) {
      if (this.get('actualCategory') === category) {
        this.set('actualCategory', false);
      } else {
        this.set('actualCategory', category);
      }
    },
    addItemToOrder(item, extras = null) {
      let orderItem = this.store.createRecord('orderitem', {order: this.get('order'), item, extras});
      this.get('orderItems').push(orderItem);
      let viewOrder = _.cloneDeep(this.get('viewOrder'));
      let id = item.get('id');
      if (viewOrder.items[id+extras] === undefined) {
        viewOrder.items[id+extras] = {};
        viewOrder.items[id+extras].amount = 0;
      }
      viewOrder.items[id+extras].identifier = id+extras;
      viewOrder.items[id+extras].amount++;
      viewOrder.items[id+extras].prize = (item.get('price') * viewOrder.items[id+extras].amount).toFixed(2);
      viewOrder.items[id+extras].categoryId = item.get('category.id');
      viewOrder.items[id+extras].name = item.get('name') + " " + item.get('amount') + item.get('unit.name');
      viewOrder.items[id+extras].extras = extras || null;
      viewOrder.items[id+extras].id = id;
      viewOrder.totalAmount += (item.get('price'));
      this.set('viewOrder', viewOrder);
    },
    removeItemFromOrder(index) {
      this.get('order').removeAt(index);
    },
    showModal(activeType, buttons, item) {
      this.set('modalType', activeType);
      this.set('modalButtons', buttons);
      this.set('modalItem', item);
      switch (activeType) {
        case 'table-select':
        this.set('modalHeadline', 'Tisch auswählen');
        break;
        case 'item-settings':
        this.set('modalHeadline', this.get('modalItem').get('name'));
        break;
        case 'discard-order':
        this.set('modalHeadline', 'Bestellung verwerfen?');
        break;
        default:
        break;
      }
      this.toggleProperty('triggerModal');
    },
    saveOrder(){
      let order = this.get('order');
      order.totalAmount = this.get('viewOrder.totalAmount');
      order.save().then(() => {this.send('resetOrder');})

    },
    resetOrder(){
      let order = this.get('order');
      this.set('orderItems', []);
      this.set('viewOrder', {items: {},totalAmount: 0});
      order.deleteRecord();
      order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);
    },
    removeItemFromOrder(data){
      let viewOrder = _.cloneDeep(this.get('viewOrder'));
      let items = this.get('orderItems');
      let toDelete = [];
      delete(viewOrder.items[data.identifier]);
      for(let i = items.length-1; i >= 0; i--){
        if(items[i].get('item.id')+items[i].get('extras') == data.identifier){
          viewOrder.totalAmount -= items[i].get('item.price');
          items.splice(i,1);
        }
      }
      this.set('viewOrder', viewOrder);
    }
  }
});
