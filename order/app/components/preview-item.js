import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['myStyle'],
  myStyle: 'style-1',
  init() {
    this._super();
    const numberOfStyles = 4;
    this.set('myStyle', `style-${(this.get('data').categoryId % numberOfStyles)}`);
  }
});
