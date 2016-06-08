/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/unit-item',
  'Integration: DashboardUnitsShowUnitComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/unit-item}}
      //     template content
      //   {{/dashboard/unit-item}}
      // `);

      this.render(hbs`{{dashboard/unit-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
