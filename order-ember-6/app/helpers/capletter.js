import { helper } from '@ember/component/helper';

export default helper(function capletter([str]) {
  return str && str[0] ? str[0].toUpperCase() : '';
});
