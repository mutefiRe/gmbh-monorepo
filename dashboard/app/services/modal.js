import Ember from 'ember';

export default Ember.Service.extend({
  showModal(element) {
      element.$().find('.modal').css('display', 'flex');
    },
    hideModal(element) {
      element.$().hide();
    }
});
