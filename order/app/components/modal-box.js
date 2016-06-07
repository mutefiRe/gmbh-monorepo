import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal'],
  classNameBindings: ['modalVisibility'],
  modalVisibility: 'hidden',
  watchTriggerModal: function () {
    console.log(this.get('triggerModal'));
    if (this.get('triggerModal')) {
      this.set('modalVisibility', '');
    } else {
      this.set('modalVisibility', 'hidden');
    }
  }.observes('triggerModal'),
  actions: {
    close() {
      this.set('triggerModal', false);
      this.set('modalVisibility', 'hidden');
    }
  }
});
