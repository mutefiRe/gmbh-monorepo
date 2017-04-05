import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  username:   DS.attr('string'),
  firstname:  DS.attr('string'),
  lastname:   DS.attr('string'),
  password:   DS.attr('string'),
  permission: DS.attr('permissions'),
  printer:    DS.attr('string'),
  areas:      DS.hasMany('area'),

  isCashier:  Ember.computed('printer', function(){
    return this.get('printer') ? true : false;
  })
});
