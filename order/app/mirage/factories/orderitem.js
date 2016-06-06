import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  createdAt() {
    return faker.date.past();
  },
  updatedAt() {
    return faker.date.recent();
  },
  extras: 'ohne Extra',
  isPaid: false,
  order() {
    return faker.Helpers.randomNumber(5);
  },
  item() {
    return faker.Helpers.randomNumber(5);
  }
});
