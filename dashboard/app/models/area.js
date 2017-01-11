import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  tables: DS.hasMany('table'),
  users: DS.hasMany('user')
});
