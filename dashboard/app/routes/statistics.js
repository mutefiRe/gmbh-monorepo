import Ember from 'ember';

export default Ember.Route.extend({
  payload: Ember.inject.service('session-payload'),
  jwt: null,

  model() {
    this.set('jwt', this.get('payload').getToken());

    return Ember.RSVP.hash({
      topSellingProducts: this.secureRequest('api/statistics/top-selling-products'),
      mostSoldProducts:   this.secureRequest('api/statistics/most-sold-products'),
      salesPerHour:       this.secureRequest('api/statistics/sales-hour'),
      salesToday:         this.secureRequest('api/statistics/sales-today'),
      sales:              this.secureRequest('api/statistics/sales')
    });
  },
  secureRequest(url) {
    return $.ajax({ headers: { 'X-Access-Token': this.get('jwt') }, url: `${window.EmberENV.host}/${url}` });
  }
});
