import Ember from 'ember';

export default Ember.Component.extend({
  isShowingUpdate: true,
  tagName: 'tr',
  actions: {
    save() {
      this.toggleProperty('isShowingUpdate');
      this.get('unit').save();
    },
    toggle() {
      this.toggleProperty('isShowingUpdate');
    },
    destroyUnit() {
      this.get('unit').destroyRecord();
    }
  }
});
