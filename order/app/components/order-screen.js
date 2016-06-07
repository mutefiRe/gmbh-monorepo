import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Ember.Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['order-screen','none'],
  //classNameBindings: ['SwipeChange'],
  SwipeChange: function() {
    if (this.get('swipeHelper.order-screen.active') && this.get('swipeHelper.order-list.last')){
      return 'slide-right-in';
    } else if (this.get('swipeHelper.order-screen.last') && this.get('swipeHelper.order-list.active')) {
      return 'slide-left-out';
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
    }
  }
});
