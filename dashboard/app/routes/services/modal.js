import Ember from 'ember';

export default Ember.Service.extend({
  showModal(element, pickable) {
    element.$().find('.modal').has(pickable).css('display', 'flex').hide().fadeIn(100);
  },
  hideModal(element) {
    element.$().fadeOut(100);
  }
});