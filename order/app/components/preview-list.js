import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['preview-list'],
  tagName: 'ul',
  swipeLeft(){
    this.set('swipeHelper.order-list.active', true);
    this.set('swipeHelper.order-list.last', false);
    this.set('swipeHelper.order-screen.active', false);
    this.set('swipeHelper.order-screen.last', true);
  },
  actions: {
    openOnTap() {
      console.log('open');
    }
  }
});
