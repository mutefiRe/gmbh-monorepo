import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'button',
  classNames: ['single-item'],
  actions: {
  },
  click() {
    this.get('addItemToOrder')(this.get('item'))
  }
})
