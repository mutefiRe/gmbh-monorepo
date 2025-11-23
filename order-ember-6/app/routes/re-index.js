import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ReIndexRoute extends Route {
  @service router;

  redirect() {
    this.router.transitionTo('index');
  }
}
