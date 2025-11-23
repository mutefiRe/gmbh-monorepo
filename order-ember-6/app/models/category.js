import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CategoryModel extends Model {
  @attr name;
  @attr('boolean') enabled;
  @attr description;
  @attr('date') createdAt;
  @attr('date') updatedAt;
  @attr('boolean') showAmount;
  @attr icon;
  @belongsTo('printer', { async: true, inverse: null }) printer;
  @belongsTo('category', { async: true, inverse: null }) category;
  @hasMany('item', { async: true }) items;
  @attr('string', { defaultValue: '#aabbcc' }) color;

  get enabledItems() {
    return (this.items || []).filter(item => item.enabled);
  }

  get sortedItems() {
    return this.enabledItems.sort((a, b) => {
      if (a.group !== b.group) return a.group - b.group;
      if (a.name !== b.name) return a.name.localeCompare(b.name);
      return a.price - b.price;
    });
  }

  get textcolor() {
    const color = this.color;
    const R = parseInt(color.substring(1, 3), 16);
    const G = parseInt(color.substring(3, 5), 16);
    const B = parseInt(color.substring(5, 7), 16);
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance > 127 ? 'black' : 'white';
  }

  get lightcolor() {
    return modifyBrightness(this.color, 0.3);
  }
}

function modifyBrightness(color, percent) {
  const hex = parseInt(color.slice(1), 16);
  const target = percent < 0 ? 0 : 255;
  const R = hex >> 16;
  const G = hex >> 8 & 0x00FF;
  const B = hex & 0x0000FF;
  percent = percent < 0 ? percent * -1 : percent;
  return (
    '#' + (
      (Math.round((target - R) * percent) + R) * 0x10000 +
      (Math.round((target - G) * percent) + G) * 0x100 +
      (Math.round((target - B) * percent) + B) +
      0x1000000
    ).toString(16).slice(1)
  );
}
