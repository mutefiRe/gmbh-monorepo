import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return `u${i}`;
  },
  enabled: 1,
  description: 'Müller',
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  items() {
    return faker.Helpers.randomNumber(20);
  },
  category() {
    return faker.Helpers.randomNumber(5);
  }
});
