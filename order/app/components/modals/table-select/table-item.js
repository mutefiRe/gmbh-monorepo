import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['table-item'],
  classNameBindings: ['styleType'],
  styleType: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;

    const areaId = this.get('table').get('area').get('id');
    this.set('styleType', `style-${(areaId ? areaId : 1 % numberOfStyles)}`);
  },
  click() {
    this.get('setTable')(this.get('table'));
  }
});
