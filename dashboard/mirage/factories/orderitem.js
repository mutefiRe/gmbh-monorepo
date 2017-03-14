import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  extras: 'ohne Extra',
  isPaid() {
    return faker.random.boolean();
  }
});
