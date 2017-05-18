import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  tagName: 'div',
  actions: {
    selectAndClose(color) {
      Ember.set(this.category, 'color', color);
      this.set('switch', false);
    }
  }
});
