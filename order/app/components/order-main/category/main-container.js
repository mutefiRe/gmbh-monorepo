import Ember from 'ember';

export default Ember.Component.extend({
  actualCategory: null,
  classNames: ['category'],
  tagName: 'div',
  actions: {
    changeCategory(category) {
      this.get('changeCategory')(category);
      this.set('actualCategory', category);
    }
  }
});
