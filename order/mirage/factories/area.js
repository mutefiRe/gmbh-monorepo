import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Area ${i}`;
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
