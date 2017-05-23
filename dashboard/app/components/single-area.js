import Ember from 'ember';

export default Ember.Component.extend({
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle({ component: this, record: this.get('area') });
    },
    updateArea(area) {
      area.save();
    },
    destroyArea(area) {
      area.destroyRecord();
    }

  }
});
