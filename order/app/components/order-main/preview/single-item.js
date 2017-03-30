import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['preview_single-item'],
  attributeBindings: ['style'],
  style: Ember.computed('item.item.category.color', function(){
    return 'color: ' + this.get('item.item.category.textcolor') + '; background-color: ' + this.get('item.item.category.color');
  }),
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
