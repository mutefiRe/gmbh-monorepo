import Ember from 'ember';

export default Ember.Component.extend({
  tableArea: null,
  tagName: 'tr',
  disabled: function () {
    if (typeof this.get('name') === 'undefined' || this.get('name') === '') {
      return true;
    }

    return false;
  }.property('name'),
  actions: {
    saveTable() {
      this.get('saveTable')({
        name: this.get('name'),
        area: this.get('tableArea')
      });
      this.set('name', '');
    },
    selectTagType() {
      const selectedEl = this.$('#tag-type-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#tag-type-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('areas').forEach((item) => {
        if (item.get('id') === selectedValue) {
          this.set('tableArea', item);
        }
      });
    }
  }
});
