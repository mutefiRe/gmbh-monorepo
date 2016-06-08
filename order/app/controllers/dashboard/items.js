import Ember from 'ember';

export default Ember.Controller.extend({
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
