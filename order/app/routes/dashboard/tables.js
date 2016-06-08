import Ember from 'ember';
import AuthenticatedRouteMixin from '../../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      tables: this.store.findAll('table'),
      areas: this.store.findAll('area')
    });
  }
});
