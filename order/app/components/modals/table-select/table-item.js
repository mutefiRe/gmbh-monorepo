import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['table-item'],
  attributeBindings: ['style'],
  style: Ember.computed('table.area', function(){
    return Ember.String.htmlSafe('color: ' + this.get('table.area.textcolor') + '; background-color: ' + this.get('table.area.color'));
  }),
  areaColor: Ember.computed('table.area.darkcolor', function(){
    return Ember.String.htmlSafe('background-color: ' + this.get('table.area.darkcolor') + '; color: #FFFFFF;');
  }),
  click() {
    this.get('setTable')(this.get('table'));
  }
});
