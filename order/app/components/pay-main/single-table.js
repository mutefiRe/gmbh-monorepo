import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['single-item','style-1'],
  tagName: 'div',
  click() {
    this.set('actualOrder', this.get('table'));
    this.get('goToOrderDetail')();
  }
});
