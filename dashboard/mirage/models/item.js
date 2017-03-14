import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  unit:     belongsTo('unit'),
  category: belongsTo('category')
});
