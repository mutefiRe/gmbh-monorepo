/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard-categories-add-category',
  'Integration: DashboardCategoriesAddCategoryComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard-categories-add-category}}
      //     template content
      //   {{/dashboard-categories-add-category}}
      // `);

      this.render(hbs`{{dashboard-categories-add-category}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
