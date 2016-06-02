import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['table-item'],
  classNameBindings: ['priority'],
  priority: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;

    this.set('priority', `style-${(this.get('table').get('area').get('id') % numberOfStyles)}`);
  }
});
