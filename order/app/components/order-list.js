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
    saveOrder() {
      this.get('saveOrder')();
    },
    resetOrder() {
      this.get('resetOrder')();
    },
    removeItemFromOrder(data){
      this.get('removeItemFromOrder')(data);
    }
  }
});
