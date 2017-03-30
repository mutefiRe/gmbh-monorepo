import Ember from 'ember';

export default Ember.Component.extend({
  modal: Ember.inject.service(),
  tagName: 'div',
  classNames: ['product_single-item'],
  attributeBindings: ['style'],
  style: Ember.computed('category', function(){
    return 'color: ' + this.get('item.category.textcolor') + '; background-color: ' + this.get('item.category.color');
  }),
  clickDelay: 500,

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
