import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  firstname: DS.attr('string'),
  lastname: DS.attr('string'),
  password: DS.attr('string'),
  role: DS.attr('string', {defaultValue: "waiter"}),
  areas: DS.hasMany('area'),
  printer: DS.belongsTo('printer'),
  createdAt: DS.attr('date')
});
