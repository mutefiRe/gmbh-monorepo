import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      events: this.store.findAll('setting'),
      printers: this.store.findAll('printer')
    });
  }
});
