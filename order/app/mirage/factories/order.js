import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  user() {
    return faker.Helpers.randomNumber(20);
  },
  table() {
    return faker.Helpers.randomNumber(5);
  },
  orderitems() {
    return faker.Helpers.randomNumber(5);
  }
});
