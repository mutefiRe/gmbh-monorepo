/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/category-item-new',
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
      //   {{#dashboard/category-item-new}}
      //     template content
      //   {{/dashboard/category-item-new}}
      // `);

      this.render(hbs`{{dashboard/category-item-new}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
