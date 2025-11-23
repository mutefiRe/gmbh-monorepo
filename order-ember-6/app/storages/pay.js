import StorageArray from 'ember-local-storage/local/array';
import { service } from '@ember/service';

export default class PayStorage extends StorageArray {
  @service store;

  delete(orderId) {
    const orders = this.getArray();
    this.clear();
    orders.forEach(order => {
      if (order.id !== orderId) this.addObject(order);
    });
  }

  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  }

  createOrderitemRecord(orderitem) {
    const orderitemRecord = this.store.peekRecord('orderitem', orderitem.id);
    orderitemRecord.set('count', orderitem.count);
    orderitemRecord.set('countFree', orderitem.countFree);
    orderitemRecord.set('countPaid', orderitem.countPaid);
    return orderitemRecord;
  }

  createOrderRecord(order) {
    const orderRecord = this.store.peekRecord('order', order.id);
    orderRecord.set('totalAmount', order.totalAmount);
    order.orderitems.map(orderitem => {
      return this.createOrderitemRecord(orderitem);
    });
    return orderRecord;
  }

  recordsPromises() {
    const duplicated = [];
    return this.getArray().reverse().map(order => {
      if (duplicated.includes(order.id)) return null;
      duplicated.push(order.id);
      const orderRecord = this.createOrderRecord(order);
      // ...existing code...
    });
  }
}
