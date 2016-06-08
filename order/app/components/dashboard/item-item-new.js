import Ember from 'ember';

export default Ember.Component.extend({
  itemUnit: null,
  itemCategory: null,
  tagName: 'tr',
  init() {
    this._super();
    this.set('itemUnit', this.get('units.firstObject'));
    this.set('itemCategory', this.get('categories.firstObject'));
  },
  disabled: function () {
    if (
      (this.get('name') === undefined || this.get('name') === '') ||
      (this.get('amount') === undefined || this.get('amount') === '') ||
      (this.get('price') === undefined || this.get('price') === '') ||
      (this.get('tax') === undefined || this.get('tax') === '') 
    ) {
      return true;
    } else {
      return false;
    }
  }.property('name','amount','price','tax'),
  actions: {
    createItem() {
      this.get('createItem')({
        name: this.get('name'),
        amount: this.get('amount'),
        price: this.get('price'),
        tax: this.get('tax'),
        unit: this.get('itemUnit'),
        category: this.get('itemCategory')
      });
      this.set('name', '');
      this.set('amount', '');
      this.set('price', '');
      this.set('tax', '');
    },
    selectUnit() {
      const selectedEl = this.$('#unit-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#unit-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('units').forEach((item) => {
        if (item.get('id') == selectedValue) {
          this.set('itemUnit', item);
        }
      });
    },
    selectCategory() {
      const selectedEl = this.$('#category-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#category-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('categories').forEach((item) => {
        if (item.get('id') == selectedValue) {
          this.set('itemCategory', item);
        }
      });
    }
  }
});
