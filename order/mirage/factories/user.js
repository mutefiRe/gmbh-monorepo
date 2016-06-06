import {Factory, faker} from 'ember-cli-mirage';

export default Factory.extend({
  username(i) {
    return `user_${i}`;
  },
  firstname() {
    return faker.name.firstName();
  },
  lastname() {
    return faker.name.lastName();
  },
  password: 'abc',
  permission() {
    return faker.random.number(1);
  }
});
