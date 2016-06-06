import Ember from 'ember';

export function showTime(params/*, hash*/) {
  let time = new Date(params);

  return time.toLocaleTimeString('de-DE', {hour: 'numeric', minute: 'numeric'});
}

export default Ember.Helper.helper(showTime);
