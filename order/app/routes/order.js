import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  store: Ember.inject.service('store'),
  payload: Ember.inject.service('session-payload'),
  model() {
    return Ember.RSVP.hash({
      currentUser: this.store.findRecord('user', this.get('payload').getId()),
      categories: this.store.findAll('category'),
      Items: this.store.findAll('item'),
      Units: this.store.findAll('unit'),
      Orders: this.store.findAll('order'),
      Tables: this.store.findAll('table'),
      Areas: this.store.findAll('area'),
      Settings: this.store.findAll('setting')
    });
  }
});
