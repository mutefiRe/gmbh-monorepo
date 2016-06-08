/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/area-item-new',
  'Integration: DashboardAreaItemNewComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/area-item-new}}
      //     template content
      //   {{/dashboard/area-item-new}}
      // `);

      this.render(hbs`{{dashboard/area-item-new}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
