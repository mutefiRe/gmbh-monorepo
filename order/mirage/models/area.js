import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  tables: hasMany('table'),
  users:  hasMany('user')
});