import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['orderlist'],
  tagName: 'div',
  actions: {
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    },
    showModal() {
      this.get('showModal')('table-list');
    }
  }
});
