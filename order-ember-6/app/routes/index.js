import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;
  @service payload;
  @service session;

  @service router;

  async beforeModel(transition) {
    if (!this.session.isAuthenticated || !this.payload.getId()) {
      // Redirect to login if not authenticated or user id missing
      this.router.transitionTo('login');
    }
  }

  async model() {
    return {
      currentUser: await this.store.findRecord('user', this.payload.getId()),
      categories: await this.store.findAll('category'),
      items: await this.store.findAll('item'),
      units: await this.store.findAll('unit'),
      orders: await this.store.findAll('order'),
      tables: await this.store.findAll('table'),
      areas: await this.store.findAll('area'),
      settings: await this.store.findAll('setting'),
      printers: await this.store.findAll('printer')
    };
  }
}
