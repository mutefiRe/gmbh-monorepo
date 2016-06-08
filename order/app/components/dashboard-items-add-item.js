import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    createItem() {
      this.get('createItem')(
        {
          name: this.get('name'),
          amount: this.get('amount'),
          price: this.get('price'),
          tax: this.get('tax'),
          unit: this.get('unit'),
          category: this.get('category')
        }
      );
    }
  }
});
