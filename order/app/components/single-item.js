import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['single-item'],
  classNameBindings: ['myStyle'],
  myStyle: 'style-1',
  clickDelay: 500,
  init() {
    this._super();
    const numberOfStyles = 4;

    this.set('myStyle', `style-${(this.get('item').get('category').get('id') % numberOfStyles)}`);
  },
  actions: {
    showModal() {
      this.get('showModal')('item-settings', false, this.get('item'));
    }
  },
  click() {
    this.get('addItemToOrder')(this.get('item'));
  },
  touchStart() {
    const runLater = Ember.run.later(this, function () {
      this.triggerAction({
        action: 'showModal',
        target: this
      });
    }, this.get('clickDelay'));

    this.set('pressed', runLater);
  },
  touchEnd() {
    Ember.run.cancel(this.get('pressed'));
  }
});
