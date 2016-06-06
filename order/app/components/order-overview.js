import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-overview','hidden'],
  sortProps: ['isPaid', 'createdAt:desc'],
  sortedOrders: Ember.computed.sort('orders', 'sortProps'),
  init() {
    this._super();

  },
  actions: {

  }
});
