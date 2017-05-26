import DS from 'ember-data';

export default DS.Model.extend({
  name:        DS.attr('string'),
  enabled:     DS.attr('boolean'),
  description: DS.attr('string'),
  createdAt:   DS.attr('date'),
  updatedAt:   DS.attr('date'),
  showAmount:  DS.attr('boolean'),
  icon:        DS.attr('string'),
  printer:     DS.attr('string'),
  category:    DS.belongsTo('category'),
  items:       DS.hasMany('item'),
  color:       DS.attr('string', {defaultValue: '#aabbcc'}),

  itemsSorting: ['group', 'name', 'price'],
  enabledItems: Ember.computed.filter('items', function(item){
    return item.get('enabled');
  }),
  sortedItems: Ember.computed.sort('enabledItems', 'itemsSorting'),
  textcolor: Ember.computed('color', function() {
    const color = this.get('color');
    const R = parseInt(color.substring(1, 3), 16);
    const G = parseInt(color.substring(3, 5), 16);
    const B = parseInt(color.substring(5, 7), 16);
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance > 127 ? 'black' : 'white';
  })
});

