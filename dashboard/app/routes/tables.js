import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      tables: this.store.findAll('table'),
      areas: this.store.findAll('area')
    });
  }
});
