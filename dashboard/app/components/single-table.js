import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  areaToSet: '',
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    },
    changeRelation(table, event) {
      const area = this.get('store').peekRecord('area', event.target.value);
      this.set('areaToSet', area);
    },
    updateTable(table) {
      table.set('area', this.get('areaToSet'));
      table.save();
    },
    destroyTable(table) {
      table.destroyRecord();
    }

  }
});
