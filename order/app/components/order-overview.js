import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['order-overview'],
  sortBy: ['createdAt:desc'],
  sortedOrders: Ember.computed.sort('orders', 'sortBy'),
  openOrders: Ember.computed.filter('sortedOrders', order => {
    return order.get('orderitems').every(unpaidItem);
  }).property('orders.@each.orderitems'),
  paidOrders: Ember.computed.setDiff('sortedOrders', 'openOrders').property('orders.@each.orderitems'),
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if ((this.get('swipeHelper.order-overview.active') && this.get('swipeHelper.order-screen.last')) || (this.get('swipeHelper.order-overview.active') && this.get('swipeHelper.order-detail.last'))) {
      return 'slide-right-in';
    } else if ((this.get('swipeHelper.order-overview.last') && this.get('swipeHelper.order-screen.active')) || (this.get('swipeHelper.order-detail.active') && this.get('swipeHelper.order-overview.last'))) {
      return 'slide-left-out';
    }

    return 'none';
  }.property('swipeHelper.order-overview.active'),
  swipeLeft() {
    this.triggerAction({
      action: 'goToOrderScreen',
      target: this
    });
  },
  actions: {
    goToOrderScreen() {
      this.set('swipeHelper.order-screen.active', true);
      this.set('swipeHelper.order-screen.last', false);
      this.set('swipeHelper.order-overview.active', false);
      this.set('swipeHelper.order-overview.last', true);
      this.set('swipeHelper.order-detail.last', false);
    },
    gotToOrderDetail() {
      this.set('swipeHelper.order-detail.active', true);
      this.set('swipeHelper.order-detail.last', false);
      this.set('swipeHelper.order-overview.active', false);
      this.set('swipeHelper.order-overview.last', true);
      this.set('swipeHelper.order-screen.last', false);
    }
  }
});

function unpaidItem(item) {
  return item.get('countPaid') < item.get('count');
}