import Ember from 'ember';

export default Ember.Service.extend({
    showModal(element) {
        element.$().find('.modal').css('display', 'flex').hide().fadeIn(100);
    },
    hideModal(element) {
        element.$().fadeOut(100);
    }
});