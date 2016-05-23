import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'li',
  classNames: ['category-select-field'],
  actions: {

  },
  click() {
    this.get('changeCategory')(this.get('category'))
  }
});
