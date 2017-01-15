import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForRelationship(key, relationship) {
    console.log(key, relationship);
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }
    return key;
  },
  attrs: {
    orderitems: {embedded: 'always'}
  }
});
