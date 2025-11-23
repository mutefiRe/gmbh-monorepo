import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class OrderMainCategorySingleItemComponent extends Component {
  get style() {
    const category = this.args.category;
    const actualCategory = this.args.actualCategory;
    if (actualCategory === category || !actualCategory) {
      return `color: ${category?.textcolor}; background-color: ${category?.color}`;
    }
    return `color: ${category?.textcolor}; background-color: ${category?.lightcolor}`;
  }

  @action
  click() {
    this.args.changeCategory?.(this.args.category);
  }
}
