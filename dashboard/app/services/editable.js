import Ember from 'ember';

export default Ember.Service.extend({
  toggle(element) {
    if (element.$().hasClass('open')) {
      element.$().find('.editarea').slideToggle(() => {
        element.$().removeClass('open');
      });
      element.$().find('.singleeditindicator').html('mode_edit');
      $('body').removeClass('noscroll');
    } else {
      element.$().addClass('open');
      element.$().find('.editarea').slideToggle();
      element.$().find('.singleeditindicator').html('keyboard_arrow_down');
      $('body').addClass('noscroll');
    }
  }
});
