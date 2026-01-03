'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface } = context;
    await queryInterface.sequelize.query('ALTER TABLE `areas` DROP INDEX `name`;');
    await queryInterface.sequelize.query('ALTER TABLE `areas` DROP INDEX `short`;');
    await queryInterface.addIndex('areas', ['eventId', 'name'], {
      unique: true,
      name: 'areas_event_name_unique'
    });
    await queryInterface.addIndex('areas', ['eventId', 'short'], {
      unique: true,
      name: 'areas_event_short_unique'
    });
  }
};
