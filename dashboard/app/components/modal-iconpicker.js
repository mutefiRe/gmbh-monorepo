import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  actions: {
    selectAndClose(icon) {
      Ember.set(this.category, 'icon', icon);
      this.set('switch', false);
    }
  }
});
