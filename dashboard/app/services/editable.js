import Ember from 'ember';

export default Ember.Service.extend({
  toggle(element) {
    if (element.$().hasClass('open')) {
      element.$().find('.editarea').stop().slideUp(() => {
        element.$().removeClass('open');
      });
      element.$().find('.singleeditindicator').html('mode_edit');
      $('body').removeClass('noscroll');
    } else {
      element.$().addClass('open');
      element.$().find('.editarea').stop().slideDown();
      element.$().find('.singleeditindicator').html('keyboard_arrow_down');
      $('body').addClass('noscroll');
    }
  }
});
