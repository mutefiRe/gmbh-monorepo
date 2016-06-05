import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-settings'],
  amount: 1,
  actions: {
    add() {
      this.incrementProperty('amount');
    },
    sub() {
      if (this.get('amount') > 0) {
        this.decrementProperty('amount');
      }
    },
    addItemsToOrder(){
      for (let i = 0; i < this.get('amount'); i += 1) {
        this.get('addItemToOrder')();
      }
    }
  }
});
