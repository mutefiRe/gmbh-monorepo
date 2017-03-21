import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend({
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  recordsPromises(store) {
    return this.getArray().map(order => {
      return this.createOrderRecord(order, store).save().then(persistedOrder => {
        return store.createRecord('print', { order: persistedOrder.id, isBill: false }).save();
      });
    });
  },
  createOrderitemRecord(orderitem, store){
    let orderitemRecord = store.peekRecord('orderitem', orderitem.id);
    if (!orderitemRecord) {
      orderitemRecord = store.createRecord("orderitem", orderitem);
      orderitemRecord.set('item', store.peekRecord('item', orderitem.itemId));
    }
    return orderitemRecord;
  },
  createOrderRecord(order, store){
    let orderRecord = store.peekRecord('order', order.id);
    if (!orderRecord) {
      order.orderitems = order.orderitems.map(orderitem => {
        return this.createOrderitemRecord(orderitem, store);
      });
      orderRecord = store.createRecord('order', order);
      orderRecord.set('table', store.peekRecord('table', order.tableId));
      orderRecord.set('user', store.peekRecord('user', order.userId));
    }
    return orderRecord;
  }
});

export default Storage;
