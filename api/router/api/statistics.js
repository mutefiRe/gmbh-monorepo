'use strict';

const router    = require('express').Router();
const db        = require('../../models');
const colors    = ['#009493', '#da3f71', '#b1723b', '#8dc63f', '#3977b8', '#40b391', '#b74775', '#365b94', '#00787c', '#fbae4e', '#d6954e', '#b1723b', '#c9313a', '#a7292e', '#8e251b', '#da3f71', '#b74775', '#79426'];
const dialect   = db.sequelize.options.dialect;
const options   = {
  responsive: true,
  title:  { display: true },
  legend: { display: true },
  scales: { xAxes: [{ display: true, scaleLabel: { display: false }}], yAxes: [{ display: true, scaleLabel: { display: true }}]
  }
};

// total sales (value)
router.get('/sales', function(req, res){
  const query = {
    mysql:    `SELECT SUM(price * countPaid) AS sales FROM orderitems WHERE countPaid <> 0`,
    postgres: `SELECT SUM(price * "countPaid") AS sales FROM orderitems WHERE "countPaid" <> 0`
  };

  db.sequelize.query(query[dialect], { type: db.sequelize.QueryTypes.SELECT })
  .then(value => { res.send(value[0]); })
  .catch(()  => {
    res.status(400).send({ 'errors': { 'msg': 'Error on generating total sales.' }});
  });
});

// today's sales (value)
router.get('/sales-today', function(req, res){
  const query = {
    mysql:   `SELECT SUM(price * countPaid) AS sales FROM orderitems
              WHERE countPaid <> 0 GROUP BY YEAR(createdAt), MONTH(createdAt), DAY(createdAt)
              ORDER BY createdAt DESC LIMIT 1`,
    postgres: `SELECT SUM(price * "countPaid") AS sales FROM orderitems WHERE "countPaid" <> 0
              GROUP BY date_trunc('year', "createdAt"), date_trunc('month', "createdAt"), date_trunc('day', "createdAt")
              ORDER BY date_trunc('year', "createdAt"), date_trunc('month', "createdAt"), date_trunc('day', "createdAt") LIMIT 1`
  };

  db.sequelize.query(query[dialect], { type: db.sequelize.QueryTypes.SELECT })
  .then(value => {
    res.send(value.length ? value[0] : { sales: 0 });
  }).catch(() => {
    res.status(400).send({ 'errors': { 'msg': 'Error on generating sales per day.'}});
  });
});

// the ten top-selling products (graph)
router.get('/top-selling-products', function(req, res){
  const query = {
    mysql:    `SELECT items.name, SUM(orderitems.price * orderitems.countPaid) AS sales
              FROM gmbh.orderitems INNER JOIN gmbh.items ON gmbh.orderitems.itemId = gmbh.items.id
              WHERE orderitems.countPaid <> 0 GROUP BY items.id ORDER BY sales DESC LIMIT 10`,
    postgres: `SELECT items.name, SUM(orderitems.price * orderitems."countPaid") AS sales
              FROM orderitems INNER JOIN items ON orderitems."itemId" = items.id
              WHERE orderitems."countPaid" <> 0 GROUP BY items.id ORDER BY sales DESC LIMIT 10`
  };

  db.sequelize.query(query[dialect], { type: db.sequelize.QueryTypes.SELECT })
  .then(val => {
    const data = {
      labels:   val.map(obj => obj.name),
      datasets: [{ data: val.map(obj => obj.sales), backgroundColor: colors.slice(0, val.length) }]
    };

    options.title.text                             = 'Top 10 der verkaufsstärksten Produkte';
    options.legend.display                         = false;
    options.scales.yAxes[0].scaleLabel.labelString = 'Stk.';

    res.send({data, options});
  }).catch(() => {
    res.status(400).send({ 'errors': { 'msg': 'Error on generating the 10 best-selling products.'}});
  });
});

// the ten most sold products (graph)
router.get('/most-sold-products', function(req, res){
  const query = {
    mysql:    `SELECT items.name, SUM(orderitems.countPaid) AS amount
              FROM gmbh.orderitems INNER JOIN gmbh.items ON gmbh.orderitems.itemId = gmbh.items.id
              WHERE orderitems.countPaid <> 0 GROUP BY items.id ORDER BY amount DESC LIMIT 10`,
    postgres: `SELECT items.name, SUM(orderitems."countPaid") AS amount
              FROM orderitems INNER JOIN items ON orderitems."itemId" = items.id
              WHERE orderitems."countPaid" <> 0 GROUP BY items.id ORDER BY amount DESC LIMIT 10`
  };

  db.sequelize.query(query[dialect], { type: db.sequelize.QueryTypes.SELECT })
  .then(val => {
    const data = {
      labels:   val.map(obj => obj.name),
      datasets: [{ data: val.map(obj => obj.amount), backgroundColor: colors.slice(0, val.length) }]
    };

    options.title.text                             = 'Top 10 der umsatzstärksten Produkte';
    options.legend.display                         = false;
    options.scales.yAxes[0].scaleLabel.labelString = 'Umsatz in Euro';

    res.send({data, options});
  }).catch(() => {
    res.status(400).send({ 'errors': { 'msg': 'Error on generating the 10 best-selling products'}});
  });
});

// sales per hour - last five days (graph)
router.get('/sales-hour', function(req, res){
  const query = {
    mysql:    `SELECT MONTH(createdAt) AS month, DAY(createdAt) AS day, HOUR(createdAt) as hour,
              SUM(price * countPaid) AS sales FROM gmbh.orderitems
              WHERE countPaid <> 0 AND DATEDIFF(CURDATE(), createdAt) <= 5
              GROUP BY MONTH(createdAt), DAY(createdAt), HOUR(createdAt) ORDER BY createdAt`,
    postgres: `SELECT EXTRACT(MONTH from "createdAt") AS month, EXTRACT(DAY from "createdAt") AS day, EXTRACT(HOUR from "createdAt") AS hour,
              SUM(price * "countPaid") AS sales FROM orderitems
              WHERE "countPaid" <> 0 AND date_trunc('DAY', "createdAt") > current_date - INTERVAL '5 DAYS'
              GROUP BY month, day, hour ORDER BY month, day, hour`
  };

  db.sequelize.query(query[dialect], { type: db.sequelize.QueryTypes.SELECT })
  .then(val => {
    const hours    = val.map(obj => obj.hour);
    const maxHour  = Math.max(...hours);
    const minHour  = Math.min(...hours);

    const labels   = mapLineChartLabel(maxHour, minHour);
    const datasets = mapLineChartData(val, labels.length, minHour);

    options.title.text                             = 'Umsatz pro Stunde';
    options.legend.display                         = true;
    options.scales.yAxes[0].scaleLabel.labelString = 'Umsatz in Euro';

    res.send({ data: { labels, datasets }, options });
  }).catch(() => {
    res.status(400).send({ 'errors': { 'msg': 'Error on generating sales per hour'}});
  });
});

// helper functions
function mapLineChartLabel(maxHour, minHour) {
  const result = [];
  for (let i = minHour; i <= maxHour; i++) {
    result.push(i.toString().length === 1 ? `0${i}:00` : `${i}:00`);
  }

  return result;
}

function mapLineChartData(data, numberOfHours, minHour) {
  const eventDays = [...new Set(data.map(obj => obj.day))].sort();
  const datasets  = [];

  for (let i = 0; i < eventDays.length; i++) {
    datasets.push({ 
      fill:            false,
      borderColor:     colors[i],
      backgroundColor: colors[i],
      data:            new Array(numberOfHours).fill(0)
    });
  }

  data.forEach(obj => {
    const idxDay  = eventDays.indexOf(obj.day);
    const idxHour = obj.hour - minHour;

    datasets[idxDay].label         = parseDatetime(obj.month, obj.day);
    datasets[idxDay].data[idxHour] = obj.sales;
  });

  return datasets;
}

function parseDatetime(month, day) {
  const m = month.toString().length === 1 ? `0${month}` : month;
  const d = day.toString().length   === 1 ? `0${day}`   : day;

  return `${m}.${d}`;
}

module.exports = router;
