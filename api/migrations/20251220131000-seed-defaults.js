'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const now = () => new Date();

const uuid = () => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString('hex');
};

const countRows = async (queryInterface, table) => {
  const [rows] = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
  return Number(rows?.[0]?.count || 0);
};

module.exports = {
  async up({ context }) {
    const { queryInterface } = context;
    const tables = await queryInterface.showAllTables();
    const tableNames = new Set(
      tables.map((entry) => (typeof entry === 'string' ? entry : entry.tableName || entry.name))
    );

    if (!tableNames.has('users')) {
      return;
    }

    const userCount = await countRows(queryInterface, 'users');
    if (userCount === 0) {
      const passwordAdmin = bcrypt.hashSync('bierh0len!', 10);
      const passwordWaiter = bcrypt.hashSync('gehmal25', 10);

      await queryInterface.bulkInsert('users', [
        {
          id: uuid(),
          username: 'admin',
          firstname: 'Admin',
          lastname: 'User',
          password: passwordAdmin,
          role: 'admin',
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          username: 'waiter',
          firstname: 'Waiter',
          lastname: 'User',
          password: passwordWaiter,
          role: 'waiter',
          createdAt: now(),
          updatedAt: now()
        }
      ]);
    }

    let activeEventId = null;
    let createdEvent = false;
    if (tableNames.has('events')) {
      const eventCount = await countRows(queryInterface, 'events');
      if (eventCount === 0) {
        activeEventId = uuid();
        createdEvent = true;
        await queryInterface.bulkInsert('events', [
          {
            id: activeEventId,
            name: 'Training Event',
            beginDate: null,
            endDate: null,
            createdAt: now(),
            updatedAt: now()
          }
        ]);
      } else {
        const [rows] = await queryInterface.sequelize.query('SELECT id FROM events ORDER BY createdAt DESC LIMIT 1');
        activeEventId = rows?.[0]?.id || null;
      }
    }

    if (tableNames.has('settings')) {
      const settingsCount = await countRows(queryInterface, 'settings');
      if (settingsCount === 0) {
        await queryInterface.bulkInsert('settings', [
          {
            id: uuid(),
            name: 'Default Setting',
            beginDate: null,
            endDate: null,
            customTables: false,
            instantPay: true,
            showItemPrice: true,
            expiresTime: '72h',
            activeEventId,
            createdAt: now(),
            updatedAt: now()
          }
        ]);
      } else if (activeEventId) {
        const [rows] = await queryInterface.sequelize.query('SELECT id, activeEventId FROM settings LIMIT 1');
        const setting = rows?.[0];
        if (setting && !setting.activeEventId) {
          await queryInterface.bulkUpdate('settings', { activeEventId }, { id: setting.id });
        }
      }
    }

    if (!createdEvent || !activeEventId) {
      return;
    }

    const unitStkId = uuid();
    const unitLId = uuid();
    const unitClId = uuid();

    if (tableNames.has('units')) {
      await queryInterface.bulkInsert('units', [
        { id: unitStkId, name: 'Stk.', eventId: activeEventId, createdAt: now(), updatedAt: now() },
        { id: unitLId, name: 'l', eventId: activeEventId, createdAt: now(), updatedAt: now() },
        { id: unitClId, name: 'cl', eventId: activeEventId, createdAt: now(), updatedAt: now() }
      ]);
    }

    const foodCatId = uuid();
    const drinkCatId = uuid();
    const coffeeCatId = uuid();

    if (tableNames.has('categories')) {
      await queryInterface.bulkInsert('categories', [
        {
          id: foodCatId,
          eventId: activeEventId,
          name: 'Speisen',
          enabled: true,
          icon: 'utensils',
          showAmount: false,
          color: '#f97316',
          printerId: null,
          categoryId: null,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: drinkCatId,
          eventId: activeEventId,
          name: 'Getränke',
          enabled: true,
          icon: 'beer',
          showAmount: true,
          color: '#0ea5e9',
          printerId: null,
          categoryId: null,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: coffeeCatId,
          eventId: activeEventId,
          name: 'Kaffee',
          enabled: true,
          icon: 'coffee',
          showAmount: false,
          color: '#8b5cf6',
          printerId: null,
          categoryId: null,
          createdAt: now(),
          updatedAt: now()
        }
      ]);
    }

    if (tableNames.has('items')) {
      await queryInterface.bulkInsert('items', [
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Wiener Schnitzel',
          amount: 1,
          price: 9.9,
          group: 1,
          enabled: true,
          unitId: unitStkId,
          categoryId: foodCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Käsekrainer',
          amount: 1,
          price: 4.9,
          group: 1,
          enabled: true,
          unitId: unitStkId,
          categoryId: foodCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Gulaschsuppe',
          amount: 1,
          price: 4.5,
          group: 1,
          enabled: true,
          unitId: unitStkId,
          categoryId: foodCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Brettljause',
          amount: 1,
          price: 7.5,
          group: 1,
          enabled: true,
          unitId: unitStkId,
          categoryId: foodCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Bier',
          amount: 0.5,
          price: 3.9,
          group: 2,
          enabled: true,
          unitId: unitLId,
          categoryId: drinkCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Radler',
          amount: 0.5,
          price: 3.5,
          group: 2,
          enabled: true,
          unitId: unitLId,
          categoryId: drinkCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Weißer Spritzer',
          amount: 0.5,
          price: 3.9,
          group: 2,
          enabled: true,
          unitId: unitLId,
          categoryId: drinkCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Mineralwasser',
          amount: 0.5,
          price: 2.5,
          group: 2,
          enabled: true,
          unitId: unitLId,
          categoryId: drinkCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Espresso',
          amount: 1,
          price: 2.2,
          group: 3,
          enabled: true,
          unitId: unitStkId,
          categoryId: coffeeCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Verlängerter',
          amount: 1,
          price: 2.6,
          group: 3,
          enabled: true,
          unitId: unitStkId,
          categoryId: coffeeCatId,
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: uuid(),
          eventId: activeEventId,
          name: 'Cappuccino',
          amount: 1,
          price: 3.1,
          group: 3,
          enabled: true,
          unitId: unitStkId,
          categoryId: coffeeCatId,
          createdAt: now(),
          updatedAt: now()
        }
      ]);
    }

    if (tableNames.has('areas')) {
      const tableAreaId = uuid();
      const standingAreaId = uuid();
      await queryInterface.bulkInsert('areas', [
        {
          id: tableAreaId,
          eventId: activeEventId,
          name: 'Tische',
          short: 'T',
          enabled: true,
          color: '#d1d5db',
          createdAt: now(),
          updatedAt: now()
        },
        {
          id: standingAreaId,
          eventId: activeEventId,
          name: 'Stehtische',
          short: 'S',
          enabled: true,
          color: '#fde047',
          createdAt: now(),
          updatedAt: now()
        }
      ]);

      if (tableNames.has('tables')) {
        const tables = [];
        for (let i = 1; i <= 8; i++) {
          tables.push({
            id: uuid(),
            eventId: activeEventId,
            name: `T${i}`,
            x: null,
            y: null,
            custom: false,
            enabled: true,
            areaId: tableAreaId,
            createdAt: now(),
            updatedAt: now()
          });
        }
        for (let i = 1; i <= 6; i++) {
          tables.push({
            id: uuid(),
            eventId: activeEventId,
            name: `S${i}`,
            x: null,
            y: null,
            custom: false,
            enabled: true,
            areaId: standingAreaId,
            createdAt: now(),
            updatedAt: now()
          });
        }
        await queryInterface.bulkInsert('tables', tables);
      }
    }
  },

  async down() {}
};
