import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ModalsModalBoxComponent extends Component {
  @service modal;

  @action
  close() {
    this.modal.closeModal();
  }
}
