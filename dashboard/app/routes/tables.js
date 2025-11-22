import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      tables: this.store.findAll('table'),
      areas: this.store.findAll('area')
    });
  },
  actions: {
    toggleTables() {
      const element = $(event.target).closest('li');
      if (element.hasClass('open')) {
        element.find('.tablearea').stop().slideUp(() => {
          element.removeClass('open');
        });
      } else {
        element.addClass('open');
        element.find('.tablearea').stop().slideDown();
      }
    }
  }
});
