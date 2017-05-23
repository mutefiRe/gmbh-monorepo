import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  editable: Ember.inject.service(),
  tagName: 'div',
  classNames: ['addentrybar'],
  actions: {
    createRecord() {
      const type = this.get('type');
      console.log('create ' + type);
      this.get('store').createRecord(type);
    },
    saveRecord() {
      this.get('editable').saveRecord();
    }
  }
});
