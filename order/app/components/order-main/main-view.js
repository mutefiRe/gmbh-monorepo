import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  classNames: ['order-main','screen','isActive'],
  goToOrderDetail() {
    this.get('pageTransitions').toScreen({screen: 'order-detail', from: 'right'});
  },
  goToPayMain() {
    this.get('pageTransitions').toScreen({screen: 'pay-main', from: 'left'});
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
    goToOrderDetail() {
      this.goToOrderDetail();
    },
    goToPayMain() {
      this.goToPayMain();
    }
  }
});
