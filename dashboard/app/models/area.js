import DS from 'ember-data';

export default DS.Model.extend({
  name:      DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  enabled:   DS.attr('boolean', {defaultValue: true}),
  tables:    DS.hasMany('table'),
  users:     DS.hasMany('user')
});
