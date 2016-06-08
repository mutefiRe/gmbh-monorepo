import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  itemUnit: null,
  actions: {
    updateItem() {
      this.get('item').save();
      this.triggerAction({action: 'toggle', target: this});
    },
    toggle() {
      this.toggleProperty('toggle');
    },
    delete() {
      this.get('item').destroyRecord();
    },
    selectUnit() {
      const selectedEl = this.$('#unit-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#unit-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('units').forEach((item) => {
        if (item.get('id') == selectedValue) {
          this.set('item.unit', item);
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
          this.set('item.category', item);
        }
      });
    }
  }
});
