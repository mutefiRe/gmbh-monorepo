import { Router, type Request, type Response } from 'express';
const resolveDefault = (mod: any) => mod?.default || mod;
const areas = resolveDefault(require('./api/areas'));
const users = resolveDefault(require('./api/users'));
const organizations = resolveDefault(require('./api/organizations'));
const items = resolveDefault(require('./api/items'));
const categories = resolveDefault(require('./api/categories'));
const units = resolveDefault(require('./api/units'));
const tables = resolveDefault(require('./api/tables'));
const orders = resolveDefault(require('./api/orders'));
const orderitems = resolveDefault(require('./api/orderitems'));
const settings = resolveDefault(require('./api/settings'));
const printers = resolveDefault(require('./api/printers'));
const prints = resolveDefault(require('./api/prints'));
const statistics = resolveDefault(require('./api/statistics'));
const stats = resolveDefault(require('./api/stats'));
const events = resolveDefault(require('./api/events'));
const eventScope = resolveDefault(require('../middleware/event-scope'));
const eventReadOnly = resolveDefault(require('../middleware/event-readonly'));

const router = Router();

router.use("/users", users);
router.use("/printers", printers);
router.use("/events", events);
router.use("/areas", eventScope, eventReadOnly, areas);
router.use("/organizations", eventScope, eventReadOnly, organizations);
router.use("/items", eventScope, eventReadOnly, items);
router.use("/categories", eventScope, eventReadOnly, categories);
router.use("/units", eventScope, eventReadOnly, units);
router.use("/tables", eventScope, eventReadOnly, tables);
router.use("/orders", eventScope, eventReadOnly, orders);
router.use("/orderitems", eventScope, eventReadOnly, orderitems);
router.use("/settings", settings);
router.use("/prints", eventScope, eventReadOnly, prints);
router.use("/statistics", eventScope, eventReadOnly, statistics);
router.use("/stats", eventScope, eventReadOnly, stats);

router.get('/', function (req: Request, res: Response) {
  res.status(200).send({ "msg": "you have access to the api" });
});

router.get('/healthz', function (req: Request, res: Response) {
  res.status(200).send({ status: 'ok' });
});

export default router;
