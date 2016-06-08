import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  toggle: true,
  actions: {
    updateTable() {
      this.get('table').save();
      this.triggerAction({action: 'toggle', target: this});
    },
    toggle() {
      this.toggleProperty('toggle');
    },
    delete() {
      this.get('table').destroyRecord();
    },
    selectTagType() {
      const selectedEl = this.$('#tag-type-select')[0];
      const selectedIndex = selectedEl.selectedIndex;
      const options = $('#tag-type-select option');
      const selectedValue = options[selectedIndex].value;

      this.get('areas').forEach((item) => {
        if (item.get('id') == selectedValue) {
          this.set('table.area', item);
        }
      });
    }
  }
});
