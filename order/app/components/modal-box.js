import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal'],
  classNameBindings: ['modalVisibility'],
  modalVisibility: '',
  watchTriggerModal: function () {
    this.set('modalVisibility', '');
  }.observes('triggerModal'),
  actions: {
    close() {
      this.set('modalVisibility', 'hidden');
    }
  }
});
