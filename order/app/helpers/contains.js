import Ember from 'ember';

export function contains(params/* , hash */) {
   // if (params[0].toLowerCase().includes(params[1].toLowerCase()))
    if (params[0].toLowerCase().indexOf(params[1].toLowerCase())==0)
        return true;
    else return false;
}

export default Ember.Helper.helper(contains);
