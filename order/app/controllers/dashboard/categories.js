import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createCategory(categoryObject) {
      console.log(categoryObject);
      const category = this.store.createRecord('category', categoryObject);
      console.log(category.get('printer'))
      category.save();
    }
  }
});
