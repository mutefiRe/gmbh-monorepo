import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `category ${i}`;
  },
  enabled() {
    return true;
  },
  description: 'Lorem ipsum dolor sit amet.',
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  showAmount() {
    return faker.random.boolean();
  },
  icon() {
    return faker.random.arrayElement(['drink-alc', 'drink-anti', 'food']);
  }
});
