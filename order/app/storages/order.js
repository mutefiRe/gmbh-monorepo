import StorageArray from 'ember-local-storage/local/array';
import Ember from 'ember';

const Storage = StorageArray.extend({
  store: Ember.inject.service('store'),
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  recordsPromises() {
    return this.getArray().map(order => {
      return this.createOrFindOrderRecord(order).save().then(persistedOrder => {
        return this.get('store').createRecord('print', { order: persistedOrder.id, isBill: false }).save();
      });
    });
  },
  createOrFindOrderitemRecord(orderitem){
    return this.get('store').peekRecord('orderitem', orderitem.id) || this.createOrderitemRecord(orderitem);
  },
  createOrFindOrderRecord(order){
    return this.get('store').peekRecord('order', order.id) || this.createOrderRecord(order);
  },
  createOrderRecord(order){
    order.orderitems = order.orderitems.map(orderitem => {
      return this.createOrFindOrderitemRecord(orderitem);
    });
    const orderRecord = this.get('store').createRecord('order', order);
    orderRecord.set('table', this.get('store').peekRecord('table', order.tableId));
    orderRecord.set('user', this.get('store').peekRecord('user', order.userId));
    return orderRecord;
  },
  createOrderitemRecord(orderitem){
    const orderitemRecord = this.get('store').createRecord("orderitem", orderitem);
    orderitemRecord.set('item', this.get('store').peekRecord('item', orderitem.itemId));
    return orderitemRecord;
  }
});

export default Storage;
