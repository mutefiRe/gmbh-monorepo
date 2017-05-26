import DS from 'ember-data';

export default DS.Model.extend({
  name:      DS.attr('string'),
  x:         DS.attr('number'),
  y:         DS.attr('number'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  area:      DS.belongsTo('area'),
  enabled:   DS.attr('boolean', {defaultValue: true}),
  numericID: function () {
    const id = this.get('id');

    if (id) {
      return Number(id);
    }

    return null;
  }.property('id')
});
