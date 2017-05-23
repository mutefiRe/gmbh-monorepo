import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  classNames: ['item-settings'],
  amount: 1,
  actions: {
    add() {
      this.incrementProperty('amount');
    },
    sub() {
      if (this.get('amount') > 1) {
        this.decrementProperty('amount');
      }
    },
    addItemsToOrder() {
      if (this.get('amount') < 1) {
        this.get('notification')
        return;
      }
      this.get('addItemToOrder')(this.get('modalItem'), this.get('extra'), this.get('amount'));
      this.set('amount', 1);
      this.get('modal').closeModal();
    },
    close() {
      this.get('modal').closeModal();
      this.set('amount', 1);
    }
  }
});
