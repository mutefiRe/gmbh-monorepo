import RESTSerializer from '@ember-data/serializer/rest';

export default class ApplicationSerializer extends RESTSerializer {
  keyForRelationship(key, relationship) {
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }
    return key;
  }
}
