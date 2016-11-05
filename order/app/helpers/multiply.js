import Ember from 'ember';

export function multiply(numbers) {
  let multiplied = 1;

  for (const number of numbers) {
    multiplied *= number;
  }

  return multiplied;

}

export default Ember.Helper.helper(multiply);
