import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  init() {
    this._super();
    console.log('herbert');

  },
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    }
  }
});
