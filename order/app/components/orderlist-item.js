import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['orderlist-item'],
  tagName: 'tr',
  actions: {
    deleteOrderItem() {
      this.get('deleteOrderItem')(this.get('index'));
    }
  }
});
