import Ember from 'ember';

export default Ember.Component.extend(Ember.Evented, {
  editable: Ember.inject.service(),
  modal: Ember.inject.service(),
  colorname: 'donaublue',
  colorhex: '#3E8BF4',
  icontype: 'face',
  iconname: 'Kopf',
  tagName: 'li',
  actions: {
    toggleEditable() {
      this.get('editable').toggle(this);
    },
    showModalColor() {
      this.get('modal').showModal(this, '.color');
    },
    showModalIcon() {
      this.get('modal').showModal(this, '.icon');
    },
    changeColor(hex, name) {
      this.setProperties({ colorhex: hex, colorname: name });
    },
    changeIcon(type, name) {
      this.setProperties({ icontype: type, iconname: name });
    }
  }
});