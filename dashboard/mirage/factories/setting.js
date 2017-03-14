import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Setting ${i}`;
  },
  beginDate() {
    return faker.date.past();
  },
  endDate() {
    return faker.date.future();
  },
  instantPay() {
    return true;
  }
});
