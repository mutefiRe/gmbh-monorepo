"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../models/index');
let activeEventId = null;
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
    withAuth(request, token, eventId) {
        const headers = { 'x-access-token': token };
        if (eventId)
            headers['x-event-id'] = eventId;
        return request.set(headers);
    },
    removeTimestamps(body) {
        for (const topLevelKey in body) {
            if (Array.isArray(body[topLevelKey])) {
                for (const record in body[topLevelKey]) {
                    delete body[topLevelKey][record].createdAt;
                    delete body[topLevelKey][record].updatedAt;
                    delete body[topLevelKey][record].deletedAt;
                }
            }
            else {
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
