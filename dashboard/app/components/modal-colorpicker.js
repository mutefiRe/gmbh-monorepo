import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  tagName: 'div',
  actions: {
    selectAndClose(color) {
      this.get('category').set('color', color);
      this.set('showModal', false);
    }
  }
});
