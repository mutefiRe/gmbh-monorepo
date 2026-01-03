'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface } = context;
    await queryInterface.sequelize.query('ALTER TABLE `units` DROP INDEX `name`;');
    await queryInterface.addIndex('units', ['eventId', 'name'], {
      unique: true,
      name: 'units_event_name_unique'
    });
  }
};
