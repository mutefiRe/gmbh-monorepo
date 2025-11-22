import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  area:   belongsTo('area'),
  orders: hasMany('order')
});
