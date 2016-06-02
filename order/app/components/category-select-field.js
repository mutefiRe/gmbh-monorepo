import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['category-select-field'],
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
