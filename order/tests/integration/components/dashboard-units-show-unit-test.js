/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard-units-show-unit',
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
      //   {{#dashboard-units-show-unit}}
      //     template content
      //   {{/dashboard-units-show-unit}}
      // `);

      this.render(hbs`{{dashboard-units-show-unit}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
