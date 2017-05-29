import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      users: this.get('store').findAll('user', { reload: true }),
      printers: this.get('store').findAll('printer', { reload: true })
    });
  }
});
