import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    },
    changeRelation(table, event) {
      const area = this.get('store').peekRecord('area', event.target.value)
      table.set('area', area);
    },
    updateTable(table) {
      table.save();
    },
    destroyTable(table) {
      table.destroyRecord();
    }

  }
});
