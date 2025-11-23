import RESTSerializer from '@ember-data/serializer/rest';

export default class OrderSerializer extends RESTSerializer {
  keyForRelationship(key, relationship) {
    if (relationship === 'belongsTo') {
      return `${key}Id`;
    }
    return key;
  }

  serialize(snapshot, options) {
    const json = super.serialize(snapshot, options);
    // Embed orderitems always
    if (snapshot.hasMany('orderitems')) {
      json.orderitems = snapshot.hasMany('orderitems').map(orderitemSnapshot => {
        return this.serialize(orderitemSnapshot, options);
      });
    }
    return json;
  }

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    // If orderitems are embedded, pass through as-is
    return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
  }
}
