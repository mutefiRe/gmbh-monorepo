import StorageArray from 'ember-local-storage/local/array';
import Ember from 'ember';

const Storage = StorageArray.extend({
  store: Ember.inject.service('store'),
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  },
  recordsPromises() {
    return this.getArray().map(table => {
      return this.createOrFindTableRecord(table).save();
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
