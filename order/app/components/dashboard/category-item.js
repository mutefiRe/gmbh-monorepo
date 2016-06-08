import Ember from 'ember';

export default Ember.Component.extend({
  isShowingUpdate: true,
  tagName: 'tr',
  actions: {
    save() {
      this.toggleProperty('isShowingUpdate');
      this.get('category').save();
    },
    toggle() {
      this.toggleProperty('isShowingUpdate');
    },
    destroyCategory() {
      this.get('category').destroyRecord();
    }
  }
});
