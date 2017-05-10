import Ember from 'ember';

export default Ember.Component.extend({
    editable: Ember.inject.service(),
    modal: Ember.inject.service(),
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
        }
    }
});