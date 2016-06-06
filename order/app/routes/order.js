import Ember from 'ember';
import AuthenticatedRouteMixin from '../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  store: Ember.inject.service('store'),
  model() {
    return Ember.RSVP.hash({
      categories: this.store.findAll('category'),
      Items: this.store.findAll('item'),
      Units: this.store.findAll('unit'),
      Orders: this.store.findAll('order'),
      Orderitems: this.store.findAll('orderitem'),
      Tables: this.store.findAll('table')
    });
  }
});
