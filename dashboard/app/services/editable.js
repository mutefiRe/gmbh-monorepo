import Ember from 'ember';

export default Ember.Service.extend({
  currentRecord: null,
  toggle({ component, record }) {
    if (component.$().hasClass('open')) {
      this.set('currentRecord', null);
      component.$().find('.editarea').stop().slideUp(() => {
        component.$().removeClass('open');
      });
      component.$().find('.singleeditindicator').html('mode_edit');
      $('body').removeClass('noscroll');
    } else {
      this.set('currentRecord', record);
      component.$().addClass('open');
      component.$().find('.editarea').stop().slideDown();
      component.$().find('.singleeditindicator').html('keyboard_arrow_down');
      $('body').addClass('noscroll');
    }
  }
});
