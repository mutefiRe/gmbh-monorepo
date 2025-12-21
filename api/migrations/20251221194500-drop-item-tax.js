'use strict';

module.exports = {
  async up({ context }) {
    const { queryInterface } = context;
    await queryInterface.removeColumn('items', 'tax');
  }
};
