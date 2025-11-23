import { helper } from '@ember/component/helper';

export default helper(function showCurrency([n]) {
  function swap(n, c = 2, d = '.', t = ',') {
    c = isNaN(c) ? 2 : Math.abs(c);
    let s = n < 0 ? '-' : '';
    let i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '';
    let j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
      (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  }
  return swap(n, 2, ',', '.');
});
