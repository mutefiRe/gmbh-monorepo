import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class PagetransitionsService extends Service {
  @service('-routing') routing;
  isSwiping = false;

  toScreen(input) {
    const { screen } = input;
    if (this.routing.hasRoute(screen)) {
      this.routeTransition(input, this.routing);
    } else {
      this.screenTransition(input, this);
    }
  }

  routeTransition(input, routing) {
    const { screen, from } = input;
    // Animation logic should be implemented with modifiers or CSS in Octane
    routing.transitionTo(screen);
  }

  screenTransition(input, that) {
    const { from, screen } = input;
    if (!that.isSwiping) {
      that.isSwiping = true;
      // Animation logic should be implemented with modifiers or CSS in Octane
      that.isSwiping = false;
    }
  }
}
