import DS from 'ember-data';

export default DS.Model.extend({
  "first-name": DS.attr('string'),
  "last-name": DS.attr('string'),
  "password": DS.attr('string'),
  "token": DS.attr('string'),
  "role": DS.belongsTo('role')
});
