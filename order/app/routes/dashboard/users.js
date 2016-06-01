import Ember from 'ember';
import AuthenticatedRouteMixin from '../../mixins/authenticated-route-mixin';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findAll('user');
  }
});
