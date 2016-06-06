import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['order-overview'],
  orderOverview: {
    open: [],
    paid: []
  },
  init() {
    this._super();
    this.triggerAction({
      action: 'render',
      target: this
    });
  },
  actions: {
    render() {
      this.set('orderOverview.open',[]);
      this.set('orderOverview.paid',[]);
      this.get('orders').forEach((order) => {
        if (order.get('id') != undefined) {
          if (order.get('isPaid')) {
            this.get('orderOverview.paid').push(order);
          } else {
            this.get('orderOverview.open').push(order);
          }
        }
      });
    }
  }
});
