import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  category: belongsTo('category'),
  items:    hasMany('item')
});
