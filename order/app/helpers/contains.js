import Ember from 'ember';

export function contains(params/* , hash */) {
  console.log(params)
    if (params[0].toLowerCase().includes(params[1].toLowerCase()))
        return true;
    else return false;
}

export default Ember.Helper.helper(contains);
