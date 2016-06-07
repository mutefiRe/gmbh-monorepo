import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  actions: {
    toggleUpdate(item = null) {
      this.toggleProperty('isShowingUpdate');
      if (item !== null) {
        console.log('item: ', item.get('name'));
        item.save();
      }
    },
    destroyItem(item = null) {
      this.get('destroyItem')(item);
    }
  }
});
