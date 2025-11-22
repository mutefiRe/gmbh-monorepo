import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Table ${i}`;
  },
  x() {
    return faker.random.number(100);
  },
  y() {
    return faker.random.number(100);
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  enabled() {
    return true;
  }
});
