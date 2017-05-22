import StorageArray from 'ember-local-storage/local/array';
import Ember from 'ember';

const Storage = StorageArray.extend({
  store: Ember.inject.service('store'),
  delete(tableId){
    const tables = this.getArray();
    this.clear();
    tables.forEach(table => {
      if (table.id !== tableId) this.addObject(table);
    });
  },
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  recordsPromises() {
    return this.getArray().map(table => {
      return this.createOrFindTableRecord(table).save()
        .then(persistedTable => this.delete(persistedTable.id));
    });
  },
  createOrFindTableRecord(table){
    return this.get('store').peekRecord('table', table.id) || this.createTableRecord(table);
  },
  createTableRecord(table){
    const tableRecord = this.get('store').createRecord('table', table);
    tableRecord.set('area', this.get('store').peekRecord('area', table.areaId));
    return tableRecord;
  }
});

export default Storage;
