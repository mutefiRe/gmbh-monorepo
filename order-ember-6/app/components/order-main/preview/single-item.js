import Component from '@glimmer/component';

export default class OrderMainPreviewSingleItemComponent extends Component {
  get style() {
    const category = this.args.item?.item?.category;
    return `color: black${category?.textcolor}; border-left: 5px solid ${category?.color}`;
  }

  didUpdate() {
    // Animation logic would be handled in the template or with a modifier in Octane
  }
}
