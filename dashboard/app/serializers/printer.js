import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend({
  i18n: Ember.inject.service(),
  keyForRelationship(key, relationship) {
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }
    return key;
  },
  normalize(modelClass, hash, prop) {
    hash.name = hash.name || this.get('i18n').t('no printer name');
    return this._super(modelClass, hash, prop);
  }
});
