import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['single-item'],
  classNameBindings: ['myStyle'],
  myStyle: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;

    this.set('myStyle', `style-${(this.get('item').get('category').get('id') % numberOfStyles)}`);
  },
  actions: {
  },
  click() {
    this.get('addItemToOrder')(this.get('item'));
  }
});
