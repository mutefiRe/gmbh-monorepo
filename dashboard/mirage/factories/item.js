import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Item ${i}`;
  },
  amount() {
    return faker.random.number(5);
  },
  price() {
    return faker.random.number(10);
  },
  tax() {
    return faker.random.number(20);
  }
});
