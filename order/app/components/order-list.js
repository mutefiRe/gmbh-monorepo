import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['category-container'],
  tagName: 'table',
  actions: {
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    }
  }
});
