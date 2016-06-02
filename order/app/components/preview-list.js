import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['preview-list'],
  tagName: 'ul',
  actions: {
    openOnTap() {
      console.log('open');
    }
  }
});
