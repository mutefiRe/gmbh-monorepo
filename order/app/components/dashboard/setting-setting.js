import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  toggle: true,
  actions: {
    updateItem() {
      this.get('setting').save();
      this.set("toggle", true);
    },
    toggle() {
      this.toggleProperty('toggle');
    },
    click() {
      console.log("haha")
      if (this.get("toggle") == true)
      {
        this.toggleProperty('toggle');
      }
    }
  }
});
