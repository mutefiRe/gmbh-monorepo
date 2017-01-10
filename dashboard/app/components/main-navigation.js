import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['navigation'],
  actions: {
    setSubNavigation(route, title) {
      this.set('activeRoute', route);
      this.set('activeTitle', title);
      this.set('subRoutes', this.getSubRoutes());
    }
  },
  getSubRoutes() {
    const router        = Ember.getOwner(this).lookup('router:main');
    const allRoutesList = Object.keys(router.get('router.recognizer.names'));
    const activeRoute   = `${this.get('activeRoute').toLowerCase()}.`;
    const resultArray   = [];

    allRoutesList.forEach(route => {
      if (this.belongsToNavigation(route, activeRoute)) {
        resultArray.push([route, route.split('.').pop()]);
      }
    });
    return resultArray;
  },
  belongsToNavigation(route, activeRoute){
    return route.includes(activeRoute) &&
           !route.includes('error') &&
           !route.includes('index') &&
           !route.includes('loading');
  }
});
