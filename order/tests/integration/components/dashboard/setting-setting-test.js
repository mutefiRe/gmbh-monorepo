/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'dashboard/setting-setting',
  'Integration: DashboardSettingSettingComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#dashboard/setting-setting}}
      //     template content
      //   {{/dashboard/setting-setting}}
      // `);

      this.render(hbs`{{dashboard/setting-setting}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
