import { Router, type Request, type Response } from 'express';
import db from '../../models';

const router = Router();

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

router.get('/', async function (req: Request, res: Response) {
  try {
    const dialect = db.sequelize.options.dialect;
    const eventId = (req as Request & { eventId?: string }).eventId;
    const revenueQuery: Record<string, string> = {
      mysql: 'SELECT SUM(orderitems.price * `count`) AS revenue FROM gmbh.orderitems INNER JOIN gmbh.orders ON orderitems.orderId = orders.id WHERE orders.eventId = :eventId',
      postgres: 'SELECT SUM(orderitems.price * "count") AS revenue FROM orderitems INNER JOIN orders ON orderitems."orderId" = orders.id WHERE orders."eventId" = :eventId'
    };

    const [revenueRow] = await db.sequelize.query(revenueQuery[dialect], {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { eventId }
    });
    const totalRevenue = Number((revenueRow as { revenue?: number | string })?.revenue || 0);

    const [ordersCount, activeTables] = await Promise.all([
      db.Order.count({ where: { eventId } }),
      db.Table.count({ where: { enabled: true, eventId } })
    ]);

    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const ordersForSales = await db.Order.findAll({
      where: { createdAt: { [db.Sequelize.Op.gte]: since }, eventId },
      include: [{ model: db.Orderitem }],
      order: [['createdAt', 'DESC']]
    });

    const salesMap = new Map<string, number>();
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const key = formatDateKey(day);
      salesMap.set(key, 0);
    }

    ordersForSales.forEach((order: any) => {
      const dateKey = formatDateKey(new Date(order.createdAt));
      const items = order.orderitems || [];
      const orderTotal = items.reduce((sum: number, oi: any) => sum + Number(oi.price) * oi.count, 0);
      if (salesMap.has(dateKey)) {
        salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + orderTotal);
      }
    });

    const salesByDay = Array.from(salesMap.entries()).map(([date, sales]) => ({ date, sales }));

    const recentOrders = await db.Order.findAll({
      where: { eventId },
      include: [
        { model: db.Orderitem },
        { model: db.Table, include: [{ model: db.Area }] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const recent = recentOrders.map((order: any) => {
      const items = order.orderitems || [];
      const orderTotal = items.reduce((sum: number, oi: any) => sum + Number(oi.price) * oi.count, 0);
      const table = order.table;
      const area = table?.area;
      const tableLabel = table
        ? `Tisch ${area?.short || ''}${table.name}${area?.name ? ` (${area.name})` : ''}`
        : 'Unbekannter Tisch';
      return {
        id: order.id,
        number: order.number,
        total: orderTotal,
        tableName: tableLabel
      };
    });

    res.send({
      totalRevenue,
      ordersCount,
      activeTables,
      averageOrderValue: ordersCount ? totalRevenue / ordersCount : 0,
      salesByDay,
      recentOrders: recent
    });
  } catch (error: any) {
    res.status(400).send({
      errors: {
        msg: error?.errors?.[0]?.message || error?.message || 'Error on generating stats.'
      }
    });
  }
});

export default router;
