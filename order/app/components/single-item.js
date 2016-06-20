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

    this.set('myStyle', `style-${(this.get('item.category.id') % numberOfStyles)}`);
  },
  actions: {
    showModal() {
      this.get('showModal')('item-settings', false, this.get('item'));
    },
    cancel() {
      Ember.run.cancel(this.get('pressed'));
    }
  },
  click() {
    this.get('addItemToOrder')(this.get('item'));
  },
  panStart() {
    this.triggerAction({action: 'cancel', target: this});
  },
  touchStart() {
    const runLater = Ember.run.later(this, function () {
      this.triggerAction({action: 'showModal', target: this});
    }, this.get('clickDelay'));

    this.set('pressed', runLater);
  },
  touchEnd() {
    this.triggerAction({action: 'cancel', target: this});
  }
});
