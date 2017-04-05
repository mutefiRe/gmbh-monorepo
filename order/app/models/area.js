import DS from 'ember-data';

export default DS.Model.extend({
  name:      DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  tables:    DS.hasMany('table'),
  users:     DS.hasMany('user'),
  enabled:   DS.attr('boolean', { defaultValue: true }),
  color:     DS.attr("string", {defaultValue: '#aabbcc'}),

  textcolor: Ember.computed("color", function() {
    const color = this.get("color");
    const R = parseInt(color.substring(1, 3), 16);
    const G = parseInt(color.substring(3, 5), 16);
    const B = parseInt(color.substring(5, 7), 16);
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance > 127 ? "black" : "white";
  })
});
