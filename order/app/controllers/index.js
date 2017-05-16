import Ember from 'ember';
import { storageFor } from 'ember-local-storage';

export default Ember.Controller.extend({
  classNames: ['order'],
  session: Ember.inject.service('session'),
  payload: Ember.inject.service('session-payload'),
  modal: Ember.inject.service('modal'),
  actualCategory: false,
  order: null,
  orderItems: [],
  user: null,
  actualOrder: null,
  connection: Ember.inject.service('connection'),
  orderStorage: storageFor('order'),
  payStorage: storageFor('pay'),
  tableStorage: storageFor('table'),
  init() {
    const id = this.get('payload').getId();
    this.store.find('user', id).then(user => {
      this.set('user', user);
      const order = this.store.createRecord('order', {});
      order.set('user', user);
      this.set('order', order);

      if (this.get('user.isCashier')) {
        this.store.findAll('table').then(table => {
          order.set('table', table.get('firstObject'));
        });
      }
    });
  },
  actions: {
    setActualOrder(table){
      this.set('actualOrder', table);
    },
    changeCategory(category) {
      if (this.get('actualCategory') === category) {
        this.set('actualCategory', false);
      } else {
        this.set('actualCategory', category);
      }
    },
    addItemToOrder(item, extras = null) {
      const order = this.get('order');

      const orderitem = order.get('orderitems')
        .filterBy('item.id', item.id)
        .filterBy('extras', extras);

      if (orderitem.length === 0) {
        const newOrderitem = this.store.createRecord('orderitem', { order: this.get('order'), item, extras, price: item.get('price') });
        if (newOrderitem.get('price') === 0) newOrderitem.set('countPaid', 1);

      } else {
        orderitem[0].incrementProperty('count');
        if (orderitem[0].get('price') === 0) orderitem[0].incrementProperty('countPaid');
      }
    },
    saveOrder(goToOrderMain) {
      this.set('goToOrderMain', goToOrderMain);
      const order = this.get('order');

      this.get('modal').showModal({ activeType: 'loading-box' });
      this.get('connection.status') ? this.saveOrderAPI(order) : this.saveOrderOffline(order);
    },
    resetOrder() {
      const order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);
    },
    discardOrder() {
      let order = this.get('order');

      order.get('orderitems').invoke('unloadRecord');
      order.unloadRecord();

      order = this.store.createRecord('order', {});
      order.set('user', this.get('user'));
      this.set('order', order);
    },
    removeItemFromOrder(orderitem) {
      const order = orderitem.get('order');
      const totalAmount = order.get('totalAmount');

      order.set('totalAmount', totalAmount - orderitem.get('price') * orderitem.get('count'));
      this.store.deleteRecord(orderitem);
    },
    printBill(orderId) {
      this.get('modal').showModal({ activeType: 'loading-box' });
      this.store.createRecord('print', { order: orderId, isBill: true }).save().then(() => {
        this.get('modal').closeModal();
      });
    },
    socketDisconnected() {
      this.get('connection').setStatus(false);
    },
    socketReconnected() {
      this.get('connection').setStatus(true);
      if (this.get('order.user') && this.get('order.table')) this.syncOfflineStorages();
    }
  },
  syncOfflineStorages() {
    Promise.all(this.get('tableStorage').recordsPromises()).then(() => {
      this.get('tableStorage').clear();
      return Promise.all(this.get('orderStorage').recordsPromises());
    }).then(() => {
      this.get('orderStorage').clear();
      return Promise.all(this.get('payStorage').recordsPromises());
    }).then(() => {
      this.get('payStorage').clear();
    }).catch(err => {
      console.log(err); //eslint-disable-line
    });
  },
  saveOrderOffline(order) {
    const serializedOrder = order.serialize();
    serializedOrder.id = order.id;
    this.get('orderStorage').addObject(serializedOrder);
    this.send('resetOrder');
    if (this.get('model.Settings.firstObject.instantPay') || this.get('user.isCashier')) {
      this.set('actualOrder', order);
    }
    this.get('modal').closeModal();
    this.get('goToOrderMain')();
  },
  saveOrderAPI(order) {
    this.syncOfflineStorages();

    order.save().then(() => {
      return this.handleAPISaveAndPrint(order);
    }).then(() => {
      this.finishSaveProcess(order);
    }).catch(err => {
      console.log(err); //eslint-disable-line
    });
  },
  handleAPISaveAndPrint(order) {
    order.get('orderitems').filterBy('id', null).invoke('unloadRecord');
    this.send('resetOrder');
    return this.store.createRecord('print', { order: order.id, isBill: false }).save();
  },
  finishSaveProcess(order) {
    if (this.get('model.Settings.firstObject.instantPay') || this.get('user.isCashier')) {
      this.set('actualOrder', order);
    }
    this.get('modal').closeModal();
    this.get('goToOrderMain')();
  }
});
