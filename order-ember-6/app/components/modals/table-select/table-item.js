import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ModalsTableSelectTableItemComponent extends Component {
  get style() {
    const area = this.args.table?.area;
    return `color: ${area?.textcolor}; background-color: ${area?.color}`;
  }

  get areaColor() {
    const area = this.args.table?.area;
    return `background-color: ${area?.darkcolor}; color: #FFFFFF;`;
  }

  @action
  click() {
    this.args.setTable?.(this.args.table);
  }
}
