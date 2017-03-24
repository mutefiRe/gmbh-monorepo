import StorageArray from 'ember-local-storage/local/array';
import Ember from 'ember';

const Storage = StorageArray.extend({
  store: Ember.inject.service('store'),
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  createOrderitemRecord(orderitem){
    const orderitemRecord = this.get('store').peekRecord('orderitem', orderitem.id);
    orderitemRecord.set('count',     orderitem.count);
    orderitemRecord.set('countFree', orderitem.countFree);
    orderitemRecord.set('countPaid', orderitem.countPaid);
    return orderitemRecord;
  },
  createOrderRecord(order){
    const orderRecord = this.get('store').peekRecord('order', order.id);
    orderRecord.set("totalAmount", order.totalAmount);
    order.orderitems.map(orderitem => {
      return this.createOrderitemRecord(orderitem);
    });
    return orderRecord;
  },
  recordsPromises(){
    const duplicated = [];
    this.getArray().reverse().map(order => {
      if (duplicated.includes(order.id)) return null;
      duplicated.push(order.id);
      const orderRecord = this.createOrderRecord(order);
      return orderRecord.save();
    });
  }
});

export default Storage;
