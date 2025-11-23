
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ModalsDiscardOrderComponent extends Component {
  @service modal;
  @service pageTransitions;

  @action
  discardOrder() {
    this.args.discardOrder?.();
    this.modal.closeModal();
    this.pageTransitions.toScreen({ screen: 'order-main', from: 'left' });
  }

  @action
  close() {
    this.modal.closeModal();
  }
}
