import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  actions: {
    selectAndClose(icon) {
      this.get('category').set('icon', icon);
      this.set('showModal', false);
    }
  }
});
