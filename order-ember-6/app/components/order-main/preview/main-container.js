import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class OrderMainPreviewMainContainerComponent extends Component {
  @action
  swipeLeft() {
    this.args.goToOrderDetail?.();
  }

  @action
  swipeRight() {
    this.args.goToPayMain?.();
  }

  @action
  click() {
    this.args.goToOrderDetail?.();
  }
}
