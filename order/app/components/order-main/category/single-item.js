import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['category_single-item'],
  attributeBindings: ['style'],
  style: Ember.computed('category', 'actualCategory', function(){
    if(this.get('actualCategory') === this.get('category') || !this.get('actualCategory')) {
      return Ember.String.htmlSafe('color: ' + this.get('category.textcolor') + '; background-color: ' + this.get('category.color'));
    }
    return Ember.String.htmlSafe('color: ' + this.get('category.textcolor') + '; background-color: ' + this.get('category.lightcolor'));
  }),
  click() {
    this.get('changeCategory')(this.get('category'));
  }
});
