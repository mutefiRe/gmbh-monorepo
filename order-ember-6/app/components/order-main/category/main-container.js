import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OrderMainCategoryMainContainerComponent extends Component {
  @tracked actualCategory = null;

  get sortedCategories() {
    return (this.args.categories || []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  @action
  changeCategory(category) {
    this.args.changeCategory?.(category);
    this.actualCategory = category;
  }
}
