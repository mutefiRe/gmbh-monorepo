import Ember from 'ember';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  store: Ember.inject.service('store'),
  model() {
    return Ember.RSVP.hash({
      categories: this.store.findAll('category'),
      Printers: this.store.findAll('printer')
    });
  }
});
