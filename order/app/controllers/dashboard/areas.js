import Ember from 'ember';

export default Ember.Controller.extend({
  sortProps: ['area.id', 'numericID'],
  sortedTables: Ember.computed.sort('model.tables', 'sortProps'),
  actions: {
    saveArea(areaObject) {
      const area = this.store.createRecord('area', areaObject);

      area.save();
    }
  }
});
