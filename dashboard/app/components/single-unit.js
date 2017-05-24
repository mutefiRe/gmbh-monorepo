import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    updateUnit(unit) {
      unit.save();
    },
    toggleEditable() {
      this.get('editable').toggle({component: this});
    }
  }
});
