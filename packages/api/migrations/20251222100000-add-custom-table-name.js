'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface, Sequelize } = context;
    await queryInterface.addColumn('orders', 'customTableName', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
