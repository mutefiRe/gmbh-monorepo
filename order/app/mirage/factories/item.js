import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return `u${i}`;
  },
  amount: 'Peter',
  price: 'Müller',
  tax: 'terribleCleverPassword',
  unit() {
    return faker.Helpers.randomNumber(20);
  },
  category() {
    return faker.Helpers.randomNumber(5);
  }
});
