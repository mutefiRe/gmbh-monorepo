import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['orderlist'],
  tagName: 'div',
  actions: {
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    },
    showModal() {
      this.get('showModal')('table-select', true);
    },
    showModal2() {
      this.get('showModal')('discard-order', false);
    },
    saveOrder() {
      this.get('saveOrder')();
    },
    removeItemFromOrder(data) {
      this.get('removeItemFromOrder')(data);
    }
  }
});
