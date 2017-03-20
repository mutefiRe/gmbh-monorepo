import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend({
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  recordsPromises(store) {
    return this.getArray().map(order => {
      let orderRecord = store.peekRecord('order', order.id);
      if (!orderRecord) {
        order.orderitems = order.orderitems.map(orderitem => {
          let orderItemRecord = store.peekRecord('orderitem', orderitem.id);
          if (!orderItemRecord) {
            orderItemRecord = store.createRecord("orderitem", orderitem);
            orderItemRecord.set('item', store.peekRecord('item', orderitem.itemId));
          }
          return orderItemRecord;
        });
        orderRecord = store.createRecord('order', order);
        orderRecord.set('table', store.peekRecord('table', order.tableId));
        orderRecord.set('user', store.peekRecord('user', order.userId));
      }
      return orderRecord.save().then(persistedOrder => {
        return store.createRecord('print', { order: persistedOrder.id, isBill: false }).save();
      });
    });
  }
});

export default Storage;
