import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return `Table ${i}`;
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  area() {
    return faker.Helpers.randomNumber(5);
  },
  x() {
    return faker.Helpers.randomNumber(100);
  },
  y() {
    return faker.Helpers.randomNumber(100);
  }
});
