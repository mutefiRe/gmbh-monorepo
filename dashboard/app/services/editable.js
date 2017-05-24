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
  addNewRecord({ container }) {
    console.log(container);
    if (container.find('li').hasClass('open')) {
      container.find('.editarea').stop().slideUp(() => {
        container.find('li').removeClass('open');
      });
      container.find('.singleeditindicator').html('mode_edit');
      $('body').removeClass('noscroll');
    } else {
      container.find('li').addClass('open');
      container.find('.editarea').stop().slideDown();
      container.find('.singleeditindicator').html('keyboard_arrow_down');
      $('body').addClass('noscroll');
    }
  },
  saveRecord() {
    this.get('currentRecord').save().then(() => {
      this.toggle({ component: this.get('currentComponent') });
    });
  }
});
