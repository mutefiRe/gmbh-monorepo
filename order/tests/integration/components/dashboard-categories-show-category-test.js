/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard-categories-show-category',
  'Integration: DashboardCategoriesShowCategoryComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard-categories-show-category}}
      //     template content
      //   {{/dashboard-categories-show-category}}
      // `);

      this.render(hbs`{{dashboard-categories-show-category}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
