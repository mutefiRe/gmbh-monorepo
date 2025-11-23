import StorageArray from 'ember-local-storage/local/array';
import { service } from '@ember/service';

export default class OrderStorage extends StorageArray {
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

  recordsPromises() {
    return this.getArray().map(order => {
      return this.createOrFindOrderRecord(order).save().then(persistedOrder => {
        return this.store.createRecord('print', { order: persistedOrder.id, isBill: false }).save().then(() => this.delete(persistedOrder.id));
      });
    });
  }

  createOrFindOrderitemRecord(orderitem) {
    return this.store.peekRecord('orderitem', orderitem.id) || this.createOrderitemRecord(orderitem);
  }

  createOrFindOrderRecord(order) {
    return this.store.peekRecord('order', order.id) || this.createOrderRecord(order);
  }

  createOrderRecord(order) {
    order.orderitems = order.orderitems.map(orderitem => {
      return this.createOrFindOrderitemRecord(orderitem);
    });
    const orderRecord = this.store.createRecord('order', order);
    orderRecord.set('table', this.store.peekRecord('table', order.tableId));
    orderRecord.set('user', this.store.peekRecord('user', order.userId));
    return orderRecord;
  }

  createOrderitemRecord(orderitem) {
    return this.store.createRecord('orderitem', orderitem);
  }
}
