/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard-items-show-item',
  'Integration: DashboardItemsShowItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard-items-show-item}}
      //     template content
      //   {{/dashboard-items-show-item}}
      // `);

      this.render(hbs`{{dashboard-items-show-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
