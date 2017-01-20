import Ember from 'ember';

export function showCurrency(params) {
  function swap(n, c, d, t){
    if(isNaN(c)) {
      c = 2;
    } else {
      c = Math.abs(c);
    }
    d = d == undefined ? "." : d;
    t = t == undefined ? "," : t;
    let s = n < 0 ? "-" : "";
    let i = parseInt(n = Math.abs(+ n || 0).toFixed(c)) + "";
    s = n < 0 ? "-" : "";
    i = parseInt(n = Math.abs(+ n || 0).toFixed(c)) + "";
    let j = 0;
    if(i.length > 3) {
      j = i.length % 3;
    }
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

  let value = swap(params[0],2, ',', '.');
  return value;
}

export default Ember.Helper.helper(showCurrency);
