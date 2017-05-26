import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  enable: Ember.inject.service(),
  store: Ember.inject.service(),
  tagName: 'li',
  areaToSet: '',
  isEnabled: Ember.computed('table.enabled', 'table.area.enabled', function() {
    return this.get('table.enabled') && this.get('table.area.enabled');
  }),
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('table') });
    },
    toggleButton(prop) {
      this.get('table').toggleProperty(prop);
    },
    changeRelation(table, event) {
      const area = this.get('store').peekRecord('area', event.target.value);
      this.set('areaToSet', area);
    },
    updateTable(table) {
      table.set('area', this.get('areaToSet'));
      table.save().then(() => {
        this.send('toggleEditable');
      }).catch(() => {
        console.log('Error');
      });
    },
    destroyTable(table) {
      table.destroyRecord();
    }

  }
});
