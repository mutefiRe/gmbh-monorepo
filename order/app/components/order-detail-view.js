import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['order-detail-view'],
  classNameBindings: ['SwipeChange'],
  SwipeChange: function () {
    if (this.get('swipeHelper.order-detail.active') && this.get('swipeHelper.order-overview.last')) {
      return 'slide-left-in';
    } else if (this.get('swipeHelper.order-detail.last') && this.get('swipeHelper.order-overview.active')) {
      return 'slide-right-out';
    }

    return 'none';
  }.property('swipeHelper.order-detail.active'),
  swipeRight() {
    this.triggerAction({
      action: 'goToOrderOverview',
      target: this
    });
  },
  actions: {
    goToOrderOverview() {
      this.set('swipeHelper.order-overview.active', true);
      this.set('swipeHelper.order-overview.last', false);
      this.set('swipeHelper.order-detail.active', false);
      this.set('swipeHelper.order-detail.last', true);
    }
  }
});
