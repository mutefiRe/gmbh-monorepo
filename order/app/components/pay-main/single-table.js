import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pay-main_single-table'],
  tagName: 'div',
  attributeBindings: ['style'],
  style: Ember.computed('table.area', function(){
    return Ember.String.htmlSafe('color: ' + this.get('table.area.textcolor') + '; background-color: ' + this.get('table.area.color'));
  }),
  areaColor: Ember.computed('table.area.darkcolor', function(){
    return Ember.String.htmlSafe('background-color: ' + this.get('table.area.darkcolor') + '; color: #FFFFFF;');
  }),
  click() {
    this.set('actualOrder', this.get('table'));
    this.get('goToOrderDetail')();
  }
});
