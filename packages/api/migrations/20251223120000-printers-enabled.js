'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface, Sequelize } = context;
    await queryInterface.addColumn('printers', 'enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  }
};
