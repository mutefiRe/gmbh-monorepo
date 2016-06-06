import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return `Area ${i}`;
  },
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  tables() {
    return faker.Helpers.randomNumber(20);
  },
  users() {
    return faker.Helpers.randomNumber(5);
  }
});
