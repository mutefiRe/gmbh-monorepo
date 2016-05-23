import Ember from 'ember';

export default Ember.Controller.extend({
  actualCategory:{},
  order: [],
  actions: {
    changeCategory(category) {
      this.set('actualCategory', category)
    },
    addItemToOrder(item){
      this.get('order').pushObject(item)
    }
  }
});
