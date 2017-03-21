import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(), 
  tagName: 'div',
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
      this.get('modal')
        .showModal({ activeType: 'item-settings', item: this.get('item') });
    },
    cancel() {
      Ember.run.cancel(this.get('pressed'));
    }
  },
  click() {
    this.get('addItemToOrder')(this.get('item'));

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
