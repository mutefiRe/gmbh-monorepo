import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['data'],
  active: Ember.computed('activeElement', function(){
    if (this.get('activeElement') === this.get('route')) return 'active';
  }),
  click() {
    this.get('setSubNav')(this.get('route'), this.get('title'));
  }
});
