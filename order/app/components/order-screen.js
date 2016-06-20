import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe vertical-pan',
  classNames: ['order-screen'],
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if (this.get('swipeHelper.order-screen.active') && this.get('swipeHelper.order-list.last')) {
      return 'slide-right-in';
    } else if (this.get('swipeHelper.order-screen.last') && this.get('swipeHelper.order-list.active')) {
      return 'slide-left-out';
    } else if (this.get('swipeHelper.order-screen.last') && this.get('swipeHelper.order-overview.active')) {
      return 'slide-right-out';
    } else if(this.get('swipeHelper.order-screen.active') && this.get('swipeHelper.order-overview.last')) {
      return 'slide-left-in';
    }
    return 'none';
  }.property('swipeHelper.order-screen.active'),
  actions: {
    changeCategory(category) {
      this.get('changeCategory')(category);
    },
    addItemToOrder(item) {
      this.get('addItemToOrder')(item);
    },
    showModal(modalType, buttons, item) {
      this.get('showModal')(modalType, buttons, item);
    },
    goToOrderList() {
      this.set('swipeHelper.order-list.active', true);
      this.set('swipeHelper.order-list.last', false);
      this.set('swipeHelper.order-screen.active', false);
      this.set('swipeHelper.order-screen.last', true);
      this.set('swipeHelper.order-overview.last', false);
    },
    goToOrderOverview() {
      this.set('swipeHelper.order-overview.active', true);
      this.set('swipeHelper.order-overview.last', false);
      this.set('swipeHelper.order-screen.active', false);
      this.set('swipeHelper.order-screen.last', true);
      this.set('swipeHelper.order-list.last', false);
    }
  }
});
