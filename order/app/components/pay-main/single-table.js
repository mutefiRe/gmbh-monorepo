import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['pay-main_single-table','style-1'],
  tagName: 'div',
  click() {
    this.set('actualOrder', this.get('table'));
    this.get('goToOrderDetail')();
  }
});
