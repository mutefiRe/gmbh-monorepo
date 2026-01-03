const db = require('../models/index');

let activeEventId = null;
const apiBaseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

async function seedEventAndSetting() {
  const event = await db.Event.create({
    name: 'Testevent',
    beginDate: null,
    endDate: null
  });
  await db.Setting.create({
    name: 'Testsetting',
    activeEventId: event.id
  });
  activeEventId = event.id;
  return event.id;
}

module.exports = {
  async clean() {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await seedEventAndSetting();
  },

  getEventId() {
    if (!activeEventId) {
      throw new Error('activeEventId not initialized');
    }
    return activeEventId;
  },

  async requestJson({ method = 'GET', path, token, eventId, body }) {
    const headers = { accept: 'application/json' };
    if (token) headers['x-access-token'] = token;
    if (eventId) headers['x-event-id'] = eventId;
    if (body !== undefined) {
      headers['content-type'] = 'application/json';
    }
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    let json = null;
    const contentType = response.headers.get('content-type') || '';
    if (text && contentType.includes('application/json')) {
      try {
        json = JSON.parse(text);
      } catch (error) {
        json = null;
      }
    }
    return { status: response.status, body: json, text, headers: response.headers };
  },

  removeTimestamps(body) {
    for (const topLevelKey in body) {
      if (Array.isArray(body[topLevelKey])) {
        for (const record in body[topLevelKey]) {
          delete body[topLevelKey][record].createdAt;
          delete body[topLevelKey][record].updatedAt;
          delete body[topLevelKey][record].deletedAt;
        }
      } else {
        for (const key in body[topLevelKey]) {
          delete body[topLevelKey].createdAt;
          delete body[topLevelKey].updatedAt;
          delete body[topLevelKey].deletedAt;
        }
      }
    }
    return body;
  }
};
