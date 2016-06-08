import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createUnit(unitObject) {
      const unit = this.store.createRecord('unit', unitObject);

      unit.save();
    }
  }
});
