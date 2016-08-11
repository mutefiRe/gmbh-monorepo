import Ember from 'ember';
import AuthenticatedRouteMixin from '../../mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      items: this.store.findAll('item'),
      categories: this.store.findAll('category'),
      units: this.store.findAll('unit')
    });
  },
   actions: {
    reorderItems(itemModels, draggedModel) {
      this.set('currentModel.items', itemModels);
      this.set('currentModel.justDragged', draggedModel);

      for (var i = 0; i < itemModels.length; i++){
        itemModels[i].set('sortId', i)
        itemModels[i].save()
      }
    }
  }
});
