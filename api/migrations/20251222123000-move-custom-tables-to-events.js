'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface, Sequelize } = context;
    await queryInterface.addColumn('events', 'customTables', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.sequelize.query(
      'UPDATE events e JOIN settings s ON s.activeEventId = e.id SET e.customTables = s.customTables'
    );

    await queryInterface.removeColumn('settings', 'customTables');
  }
};
