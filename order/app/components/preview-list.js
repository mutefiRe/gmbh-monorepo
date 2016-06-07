import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['preview-list'],
  tagName: 'ul',
  swipeLeft() {
    this.get('goToOrderList')();
  },
  swipeRight() {
    this.get('goToOrderOverview')();
  },
  click() {
    this.get('goToOrderList')();
  }
});
