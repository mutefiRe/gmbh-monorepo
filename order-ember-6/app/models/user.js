import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr username;
  @attr firstname;
  @attr lastname;
  @attr password;
  @attr permission;
  @belongsTo('printer', { async: true, inverse: null }) printer;
  @hasMany('area', { async: true }) areas;

  get isCashier() {
    return !!this.printer;
  }
}
