import Ember from 'ember';

export default Ember.Component.extend({
  isShowingUpdate: true,
  tagName: 'tr',
  actions: {
    save() {
      this.toggleProperty('isShowingUpdate');
      this.get('user').save();
    },
    toggle() {
      this.toggleProperty('isShowingUpdate');
    },
    destroyUser() {
      this.get('user').destroyRecord();
    }
  }
});
