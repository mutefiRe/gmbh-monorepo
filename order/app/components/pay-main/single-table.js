import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pay-main_single-table'],
  tagName: 'div',
  attributeBindings: ['style'],
  style: Ember.computed('table.area', function(){
    return 'color: ' + this.get('table.area.textcolor') + '; background-color: ' + this.get('table.area.color');
  }),
  click() {
    this.set('actualOrder', this.get('table'));
    this.get('goToOrderDetail')();
  }
});
