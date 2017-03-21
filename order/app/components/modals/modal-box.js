import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  classNames: ['modal'],
  classNameBindings: ['modal.state'],
  actions: {
    close() {
      this.get('modal').closeModal();
    }
  }
});
