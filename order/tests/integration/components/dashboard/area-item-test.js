/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/area-item',
  'Integration: DashboardAreaItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/area-item}}
      //     template content
      //   {{/dashboard/area-item}}
      // `);

      this.render(hbs`{{dashboard/area-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
