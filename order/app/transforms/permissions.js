import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    switch (serialized) {
      case 0:
        return 'Admin';
      case 1:
        return 'Waiter';
      default:
        return serialized;
    }
  },

  serialize(deserialized) {
    switch (deserialized) {
      case 'Admin':
        return 0;
      case 'Waiter':
        return 1;
      default:
        return deserialized;
    }
  }
});
