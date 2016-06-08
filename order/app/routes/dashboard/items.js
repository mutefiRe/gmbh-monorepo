import Ember from 'ember';
import AuthenticatedRouteMixin from '../../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      items: this.store.findAll('item'),
      categories: this.store.findAll('category'),
      units: this.store.findAll('unit')
    });
  }
});
