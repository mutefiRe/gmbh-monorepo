import StorageArray from 'ember-local-storage/local/array';

const Storage = StorageArray.extend({
  getArray() {
    return JSON.parse(JSON.stringify(this.toArray()));
  }
});

export default Storage;
