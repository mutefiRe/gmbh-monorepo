import Ember from 'ember';

export default Ember.Component.extend({
  actualCategory: null,
  classNames: ['category-container'],
  tagName:'ul',
  actions: {
    changeCategory(category) {
      this.get('changeCategory')(category)
      this.set('actualCategory', category)
    }
  }
})
