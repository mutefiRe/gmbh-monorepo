import Ember from 'ember';

export default Ember.Service.extend({
  currentRecord: null,
  currentComponent: null,
  toggle({ component, record }) {
    if (component.$().hasClass('open')) {
      this.set('currentRecord', null);
      this.set('currentComponent', null);
      component.$().find('.editarea').stop().slideUp(() => {
        component.$().removeClass('open');
      });
      component.$().find('.singleeditindicator').html('mode_edit');
      $('body').removeClass('noscroll');
    } else {
      this.set('currentRecord', record);
      this.set('currentComponent', component);
      component.$().addClass('open');
      component.$().find('.editarea').stop().slideDown();
      component.$().find('.singleeditindicator').html('keyboard_arrow_down');
      $('body').addClass('noscroll');
    }
  },
  saveRecord() {
    this.get('currentRecord').save().then(() => {
      this.toggle({ component: this.get('currentComponent') });
    });
  }
});
