/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/item-item-new',
  'Integration: DashboardItemItemNewComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/item-item-new}}
      //     template content
      //   {{/dashboard/item-item-new}}
      // `);

      this.render(hbs`{{dashboard/item-item-new}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
