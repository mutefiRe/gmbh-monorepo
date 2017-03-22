import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  pageTransitions: Ember.inject.service('pagetransitions'),
  actions: {
    discardOrder() {
      this.get('discardOrder')();
      this.get('modal').closeModal();
      this.get('pageTransitions').toScreen({screen: 'order-main', from: 'left'});
    },
    close() {
      this.get('modal').closeModal();
    }
  }
});
