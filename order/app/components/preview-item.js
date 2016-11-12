import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['myStyle'],
  myStyle: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;
    const style = this.get('item.item.category.id');
    this.set('myStyle', `style-${(style % numberOfStyles)}`);
  }
});
