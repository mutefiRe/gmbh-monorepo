import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['category_single-item'],
  attributeBindings: ['style'],
  style: Ember.computed('category', 'actualCategory', function(){
    if(this.get('actualCategory') === this.get('category') || !this.get('actualCategory')) {
      return 'color: ' + this.get('category.textcolor') + '; background-color: ' + this.get('category.color');
    }
    return 'color: ' + this.get('category.textcolor') + '; filter: grayscale(70%); background-color: ' + this.get('category.color');
  }),
  click() {
    this.get('changeCategory')(this.get('category'));
  }
});
