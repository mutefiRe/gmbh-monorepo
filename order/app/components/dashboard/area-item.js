import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  actions: {
    updateTable() {
      this.get('area').save();
      this.triggerAction({action: 'toggle', target: this});
    },
    toggle() {
      this.toggleProperty('toggle');
    },
    delete() {
      this.get('area').destroyRecord();
    }
  }
});
