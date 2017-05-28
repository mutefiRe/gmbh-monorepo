import DS from 'ember-data';

export default DS.Model.extend({
  name:      DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  tables:    DS.hasMany('table'),
  users:     DS.hasMany('user'),
  enabled:   DS.attr('boolean', { defaultValue: true }),
  color:     DS.attr("string", {defaultValue: '#aabbcc'}),
  short:     DS.attr("string"),

  textcolor: Ember.computed("color", function() {
    const color = this.get("color");
    const R = parseInt(color.substring(1, 3), 16);
    const G = parseInt(color.substring(3, 5), 16);
    const B = parseInt(color.substring(5, 7), 16);
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    return luminance > 127 ? "black" : "white";
  }),

  brightcolor: Ember.computed("color", function() {
    return modifyBrightness(this.get('color'), 0.5);
  }),

  darkcolor: Ember.computed("color", function(){
    return modifyBrightness(this.get('color'), - 0.5);
  })
});

function modifyBrightness(color, percent){
  const hex = parseInt(color.slice(1), 16);
  const target = percent < 0 ? 0 : 255;
  const R = hex >> 16;
  const G = hex >> 8 & 0x00FF;
  const B = hex & 0x0000FF;
  percent = percent < 0 ? percent * - 1 : percent;

  // calculate distance to target color (black/darken or white/brighten)
  // multiply intensity (percentage)
  // add color to initial value
  // shift to correct position
  return "#" + (
      (Math.round((target - R) * percent) + R) * 0x10000 +
      (Math.round((target - G) * percent) + G) * 0x100 +
      (Math.round((target - B) * percent) + B) +
      0x1000000 // padding for leading zeros
    ).toString(16).slice(1);
}