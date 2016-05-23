import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'ul',
  classNames: ['item-container'],
  actions: {
    addItemToOrder(item) {
      this.get('addItemToOrder')(item)
    }
  }
});
