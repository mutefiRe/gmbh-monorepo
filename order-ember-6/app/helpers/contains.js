import { helper } from '@ember/component/helper';

export default helper(function contains([str, substr]) {
  return str.toLowerCase().indexOf(substr.toLowerCase()) === 0;
});
