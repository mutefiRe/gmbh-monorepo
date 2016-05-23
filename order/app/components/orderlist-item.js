import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteOrderItem() {
      this.get('deleteOrderItem')(this.get('index'));
    }
  }
});
