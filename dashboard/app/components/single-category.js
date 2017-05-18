import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  isShowingIcons: false,
  isShowingColors: false,
  editable: Ember.inject.service(),
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    },
    updateCategory(category) {
      category.save();
    },
    destroyCategory(category) {
      category.destroyRecord();
    }
  }
});
