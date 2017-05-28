import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  keyForRelationship(key, relationship) {
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }
    return key;
  }
});
