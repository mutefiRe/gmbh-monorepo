import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  username(i) {
    return `waiter_${i}`;
  },
  firstname() {
    return faker.name.firstName();
  },
  lastname() {
    return faker.name.lastName();
  },
  password: 'abc',
  permission() {
    return 1;
  }
});
