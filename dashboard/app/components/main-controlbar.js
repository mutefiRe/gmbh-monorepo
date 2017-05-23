import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'div',
  classNames: ['addentrybar'],
  actions: {
    saveRecord() {
      this.get('editable').currentRecord.save();
    }
  }

});
