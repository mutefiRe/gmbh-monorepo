import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'button',
  classNames: ['category-select-field'],
  actions: {

  },
  click() {
    this.get('changeCategory')(this.get('category'))
  }
});
