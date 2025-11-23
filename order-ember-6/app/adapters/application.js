import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  host = window.EmberENV?.host || '';
  namespace = 'api';

  // If you use ember-simple-auth, you may need to re-integrate authorizer logic here.
  // Example:
  // get headers() {
  //   return {
  //     Authorization: `Bearer ${yourToken}`
  //   };
  // }
}
