import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['table-item'],
  attributeBindings: ['style'],
  style: Ember.computed('table.area', function(){
    return 'color: ' + this.get('table.area.textcolor') + '; background-color: ' + this.get('table.area.color');
  }),
  click() {
    this.get('setTable')(this.get('table'));
  }
});
