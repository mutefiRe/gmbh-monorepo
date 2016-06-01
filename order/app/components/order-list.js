import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['orderlist'],
  tagName: 'table',
  actions: {
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    }
  }
});
