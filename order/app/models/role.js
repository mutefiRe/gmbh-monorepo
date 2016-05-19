import Model from 'ember-data/model';

export default DS.Model.extend({
  "name": DS.attr('string'),
  "user": DS.belongsTo('user')
});
