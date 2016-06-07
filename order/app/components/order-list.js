import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['orderlist'],
  tagName: 'div',
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if (this.get('swipeHelper.order-list.active') && this.get('swipeHelper.order-screen.last')) {
      return 'slide-left-in';
    } else if (this.get('swipeHelper.order-list.last') && this.get('swipeHelper.order-screen.active')) {
      return 'slide-right-out';
    }

    return 'none';
  }.property('swipeHelper.order-list.active'),
  swipeRight() {
    this.triggerAction({
      action: 'goToOrderScreen',
      target: this
    });
  },
  actions: {
    goToOrderScreen() {
      this.set('swipeHelper.order-screen.active', true);
      this.set('swipeHelper.order-screen.last', false);
      this.set('swipeHelper.order-list.active', false);
      this.set('swipeHelper.order-list.last', true);
    },
    deleteOrderItem(index) {
      this.get('deleteOrderItem')(index);
    },
    showModal() {
      this.get('showModal')('table-select', true);
    },
    showModal2() {
      this.get('showModal')('discard-order', false);
    },
    saveOrder() {
      this.get('saveOrder')();
    },
    removeItemFromOrder(data) {
      this.get('removeItemFromOrder')(data);
    }
  }
});
