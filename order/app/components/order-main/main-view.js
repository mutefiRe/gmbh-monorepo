import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  classNames: ['order-screen','screen','isActive'],
  goToOrderList() {
    this.get('pageTransitions').toScreen({screen: 'orderlist', from: 'right'});
  },
  goToOrderOverview() {
    this.get('pageTransitions').toScreen({screen: 'order-overview', from: 'left'});
  },
  actions: {
    changeCategory(category) {
      this.get('changeCategory')(category);
    },
    addItemToOrder(item) {
      this.get('addItemToOrder')(item);
    },
    showModal(modalType, buttons, item) {
      this.get('modal').showModal({ modalType, buttons, item });
    },
    goToOrderList() {
      this.goToOrderList();
    },
    goToOrderOverview() {
      this.goToOrderOverview();
    }
  }
});
