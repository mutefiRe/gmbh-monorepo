import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';


const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['order-overview'],
  sortProps: ['isPaid', 'createdAt:desc'],
  sortedOrders: Ember.computed.sort('orders', 'sortProps'),
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if (this.get('swipeHelper.order-overview.active') && this.get('swipeHelper.order-screen.last')) {
      return 'slide-right-in';
    } else if (this.get('swipeHelper.order-overview.last') && this.get('swipeHelper.order-screen.active')) {
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
    }
  }
});
