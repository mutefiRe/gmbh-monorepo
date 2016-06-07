import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['table-select'],
  sortProps: ['area.id', 'numericID'],
  sortedTables: Ember.computed.sort('tables', 'sortProps'),
  actions: {
    setTable(table) {
      this.set('order.table', table);
      this.get('showModal')('table-select');
    }
  }
});
