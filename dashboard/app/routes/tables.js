import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      tables: this.store.findAll('table'),
      areas: this.store.findAll('area')
    });
  },
  actions: {
    toggleEditable() {
      const element = $(event.target).closest('li');
      if (element.hasClass('open')) {
        element.find('.editarea').stop().slideUp(() => {
          element.removeClass('open');
        });
      } else {
        element.addClass('open');
        element.find('.editarea').stop().slideDown();
      }
    }
  }
});
