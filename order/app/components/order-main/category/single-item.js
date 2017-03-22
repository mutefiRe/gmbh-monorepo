import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['category_single-item'],
  classNameBindings: ['myStyle'],
  myStyle: function() {
    if (this.get('actualCategory') === this.get('category') || !this.get('actualCategory')) {
      return 'category-active';
    }

    return 'category-inactive';
  }.property('actualCategory'),
  actions: {

  },
  click() {
    this.get('changeCategory')(this.get('category'));
  }
});
