import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  editable: Ember.inject.service(),
  tagName: 'div',
  classNames: ['addentrybar'],
  actions: {
    createRecord() {
      this.get('setRecord')();
    },
    saveRecord() {
      this.get('editable').saveRecord();
    }
  }
});
