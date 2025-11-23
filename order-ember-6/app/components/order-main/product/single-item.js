import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OrderMainProductSingleItemComponent extends Component {
  @service modal;
  @tracked pressed = null;
  clickDelay = 500;

  get style() {
    const category = this.args.item?.category;
    return `color: ${category?.textcolor}; background-color: ${category?.lightcolor}; border-left: 5px solid ${category?.color};`;
  }

  @action
  showModal() {
    this.modal.showModal({ activeType: 'item-settings', item: this.args.item });
  }

  @action
  cancel() {
    if (this.pressed) {
      window.clearTimeout(this.pressed);
      this.pressed = null;
    }
  }

  @action
  click() {
    this.args.addItemToOrder?.(this.args.item);
  }

  @action
  touchStart() {
    this.mouseDown();
  }

  @action
  touchEnd() {
    this.mouseUp();
  }

  @action
  mouseDown() {
    this.pressed = window.setTimeout(() => {
      this.showModal();
    }, this.clickDelay);
  }

  @action
  mouseUp() {
    this.cancel();
  }
}
