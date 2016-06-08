/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/item-item',
  'Integration: DashboardItemItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/item-item}}
      //     template content
      //   {{/dashboard/item-item}}
      // `);

      this.render(hbs`{{dashboard/item-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
