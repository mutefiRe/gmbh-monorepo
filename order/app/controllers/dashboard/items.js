import Ember from 'ember';

export default Ember.Controller.extend({
  sortProps: ['sortId', 'category.name', 'name'],
  sortedItems: Ember.computed.sort('model.items', 'sortProps'),
  actions: {
    createItem(itemObject) {
      const item = this.store.createRecord('item', itemObject);

      item.save();
    },
    destroyItem(itemObject) {
      itemObject.destroyRecord();
    }
  }
});
