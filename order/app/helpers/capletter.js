import Ember from 'ember';

export function capletter(params/* , hash */) {
  if(params[0]){
    return params[0][0] ? params[0][0].toUpperCase() : '';
  }
  return '';
}

export default Ember.Helper.helper(capletter);
