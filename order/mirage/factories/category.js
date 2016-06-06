import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `category ${i}`;
  },
  enabled() {
    return faker.random.boolean();
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
    return faker.random.arrayElement(['drink-alc.svg', 'drink-anti.svg', 'food.svg']);
  }
});
