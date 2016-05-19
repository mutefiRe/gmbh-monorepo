import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  username(i) {
    return `u${i}`;
  },
  firstname: 'Peter',
  lastname: 'Müller',
  password: 'terribleCleverPassword',
  permission: 0
});
