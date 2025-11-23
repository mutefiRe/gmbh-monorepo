import { helper } from '@ember/component/helper';

export default helper(function multiply(numbers) {
  return numbers.reduce((acc, n) => acc * n, 1);
});
