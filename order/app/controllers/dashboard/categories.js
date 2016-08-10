import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createCategory(categoryObject) {
      const category = this.store.createRecord('category', categoryObject);
      category.save();
    }
  }
});
