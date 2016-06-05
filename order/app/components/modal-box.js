import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal'],
  classNameBindings: ['modalVisibility'],
  modalVisibility: '',// 'hidden',
  watchTriggerModal: function () {
    if(this.get('triggerModal')){
      this.set('modalVisibility', '');
    } else {
      this.set('modalVisibility', 'hidden');
    }
  }.observes('triggerModal'),
  actions: {
    close() {
      this.set('modalVisibility', 'hidden');
    }
  }
});
