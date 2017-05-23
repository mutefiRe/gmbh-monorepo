import Ember from 'ember';

export default Ember.Service.extend({
  toggleBtn(record, prop, value) {
    const result = !value;
    record.set(prop, result);
  }
});
