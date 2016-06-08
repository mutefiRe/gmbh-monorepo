import Ember from 'ember';

export default Ember.Controller.extend({
  sortProps: ['area.id','numericID'],
  sortedTables: Ember.computed.sort('model.tables', 'sortProps'),
  actions: {
    saveTable(tableObject) {
      const table = this.store.createRecord('table', tableObject);

      table.save();
    }
  }
});
