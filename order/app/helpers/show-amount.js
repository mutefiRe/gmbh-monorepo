import Ember from 'ember';

export function showAmount(params) {
  switch(params[0]){
    case 0.125:
      return "1/8";
    case 0.25:
      return "1/4";
    case 0.75:
      return "3/4";
    default:
      return params[0];
  }
}

export default Ember.Helper.helper(showAmount);
