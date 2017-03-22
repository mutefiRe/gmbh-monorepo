import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['preview_single-item'],
  classNameBindings: ['myStyle'],
  myStyle: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;
    const style = this.get('item.item.category.id');
    this.set('myStyle', `style-${(style % numberOfStyles)}`);
  },
  didUpdate() {
    const $this = this.$();
    $this.animate({
      opacity: 0.5
    },100, function(){
      $this.animate({
        opacity: 1
      },100);
    });
  }
});
