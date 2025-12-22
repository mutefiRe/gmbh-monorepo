'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const db = require('../../models');
const requireRole = require('../permissions');
async function loadSetting() {
    return db.Setting.findOne({
        attributes: { exclude: ['customTables'] }
    });
}
async function loadSettingWithTransaction(transaction) {
    return db.Setting.findOne({
        attributes: { exclude: ['customTables'] },
        transaction
    });
}
router.get('/', requireRole('admin'), async function (req, res) {
    const [setting, events] = await Promise.all([
        loadSetting(),
        db.Event.findAll({ order: [['createdAt', 'DESC']] })
    ]);
    res.send({
        events,
        activeEventId: setting?.activeEventId || null
    });
});
router.post('/', requireRole('admin'), async function (req, res) {
    const payload = req.body.event || {};
    const importFromEventId = req.body.importFromEventId || null;
    const includeRaw = req.body.include || {};
    const include = {
        units: Boolean(includeRaw.units),
        categories: Boolean(includeRaw.categories),
        items: Boolean(includeRaw.items),
        areas: Boolean(includeRaw.areas),
        tables: Boolean(includeRaw.tables)
    };
    if (include.items) {
        include.units = true;
        include.categories = true;
    }
    if (include.tables) {
        include.areas = true;
    }
    try {
        const event = await db.sequelize.transaction(async (transaction) => {
            const created = await db.Event.create(payload, { transaction });
            if (importFromEventId && (include.units || include.categories || include.items || include.areas || include.tables)) {
                const sourceEvent = await db.Event.findOne({ where: { id: importFromEventId }, transaction });
                if (!sourceEvent) {
                    throw new Error('event not found');
                }
                const unitMap = new Map();
                const categoryMap = new Map();
                const areaMap = new Map();
                if (include.units) {
                    const units = await db.Unit.findAll({ where: { eventId: importFromEventId }, transaction });
                    for (const unit of units) {
                        const data = unit.toJSON();
                        const { id, createdAt, updatedAt, eventId, ...rest } = data;
                        const createdUnit = await db.Unit.create({ ...rest, eventId: created.id }, { transaction });
                        unitMap.set(id, createdUnit.id);
                    }
                }
                if (include.categories) {
                    const categories = await db.Category.findAll({ where: { eventId: importFromEventId }, transaction });
                    for (const category of categories) {
                        const data = category.toJSON();
                        const { id, createdAt, updatedAt, eventId, categoryId, printerId, ...rest } = data;
                        const createdCategory = await db.Category.create({ ...rest, eventId: created.id, printerId: null }, { transaction });
                        categoryMap.set(id, createdCategory.id);
                    }
                    for (const category of categories) {
                        const parentId = category.categoryId;
                        if (!parentId)
                            continue;
                        const mappedParentId = categoryMap.get(parentId);
                        const mappedId = categoryMap.get(category.id);
                        if (mappedParentId && mappedId) {
                            await db.Category.update({ categoryId: mappedParentId }, { where: { id: mappedId }, transaction });
                        }
                    }
                }
                if (include.areas) {
                    const areas = await db.Area.findAll({ where: { eventId: importFromEventId }, transaction });
                    for (const area of areas) {
                        const data = area.toJSON();
                        const { id, createdAt, updatedAt, eventId, ...rest } = data;
                        const createdArea = await db.Area.create({ ...rest, eventId: created.id }, { transaction });
                        areaMap.set(id, createdArea.id);
                    }
                }
                if (include.tables) {
                    const tables = await db.Table.findAll({ where: { eventId: importFromEventId }, transaction });
                    for (const table of tables) {
                        const data = table.toJSON();
                        const { id, createdAt, updatedAt, eventId, areaId, ...rest } = data;
                        const mappedAreaId = areaId ? areaMap.get(areaId) : null;
                        await db.Table.create({ ...rest, eventId: created.id, areaId: mappedAreaId || null }, { transaction });
                    }
                }
                if (include.items) {
                    const items = await db.Item.findAll({ where: { eventId: importFromEventId }, transaction });
                    for (const item of items) {
                        const data = item.toJSON();
                        const { id, createdAt, updatedAt, eventId, unitId, categoryId, ...rest } = data;
                        await db.Item.create({
                            ...rest,
                            eventId: created.id,
                            unitId: unitId ? unitMap.get(unitId) || null : null,
                            categoryId: categoryId ? categoryMap.get(categoryId) || null : null
                        }, { transaction });
                    }
                }
            }
            return created;
        });
        res.send({ event });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
router.put('/:id', requireRole('admin'), async function (req, res) {
    const payload = req.body.event || {};
    try {
        const event = await db.Event.findOne({ where: { id: req.params.id } });
        if (!event) {
            res.status(404).send({ errors: { msg: 'event not found' } });
            return;
        }
        const updated = await event.update(payload);
        res.send({ event: updated });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
router.delete('/:id', requireRole('admin'), async function (req, res) {
    const eventId = req.params.id;
    const [setting, event] = await Promise.all([
        loadSetting(),
        db.Event.findOne({ where: { id: eventId } })
    ]);
    if (!event) {
        res.status(404).send({ errors: { msg: 'event not found' } });
        return;
    }
    if (setting?.activeEventId === eventId) {
        res.status(400).send({ errors: { msg: 'event is active' } });
        return;
    }
    try {
        await db.sequelize.transaction(async (transaction) => {
            await loadSettingWithTransaction(transaction);
            const orders = await db.Order.findAll({
                where: { eventId },
                attributes: ['id'],
                transaction
            });
            const orderIds = orders.map((order) => order.id);
            if (orderIds.length) {
                await db.Orderitem.destroy({ where: { orderId: orderIds }, transaction });
            }
            await db.Order.destroy({ where: { eventId }, transaction });
            await db.Item.destroy({ where: { eventId }, transaction });
            await db.Category.destroy({ where: { eventId }, transaction });
            await db.Unit.destroy({ where: { eventId }, transaction });
            await db.Table.destroy({ where: { eventId }, transaction });
            await db.Area.destroy({ where: { eventId }, transaction });
            await db.Organization.destroy({ where: { eventId }, transaction });
            await db.Event.destroy({ where: { id: eventId }, transaction });
        });
        res.send({ success: true });
    }
    catch (err) {
        res.status(400).send({
            errors: { msg: err.errors?.[0]?.message || err.message }
        });
    }
});
module.exports = router;
