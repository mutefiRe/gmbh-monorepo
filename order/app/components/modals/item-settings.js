import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  classNames: ['item-settings'],
  amount: 1,
  actions: {
    add() {
      if(this.get('amount') < 51){
        this.incrementProperty('amount');
      }
    },
    sub() {
      if (this.get('amount') > 0) {
        this.decrementProperty('amount');
      }
    },
    addItemsToOrder() {
      for (let i = 0; i < this.get('amount'); i += 1) {
        this.get('addItemToOrder')(this.get('modalItem'), this.get('extra'));
      }
      this.get('modal').closeModal();
    },
    close() {
      this.get('modal').closeModal();
      this.set('amount', 1);
    }
  }
});
