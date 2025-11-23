import { helper } from '@ember/component/helper';

export default helper(function showAmount([value]) {
  switch (value) {
    case 0.125: return '1/8';
    case 0.25: return '1/4';
    case 0.75: return '3/4';
    default: return value;
  }
});
