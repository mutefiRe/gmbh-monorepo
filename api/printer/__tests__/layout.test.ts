const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const proxyquire = require('proxyquire');

const order = {
  "id": 4,
  "createdAt": "date",
  "orderitems": [],
  "number": 3,
  "table": {
    "name": "T3",
    "area": {
      "name": "Terrasse"
    }
  },
  "user": {
    "firstname": "Vor",
    "lastname": "Nach"
  }
};
const layout = proxyquire('../layout', {
  './util': {
    lpad(i) {return i;},
    rpad(i) {return i;},
    cpad(i) {return i;},
    formatDate(i) {return i;}
  }
});

describe('layout deliveryNote test', () => {
  it('should format deliveryNote with dishes', () => {
    const items = [{
      "id": 9,
      "extras": null,
      "count": 3,
      "item": {
        "id": 33,
        "name": "Waffeln mit Sauerkraut",
        "amount": 1,
        "unit": {
          "name": "Stk."
        },
        "category": {
          "name": "Speisen",
          "showAmount": false
        }
      }
    },{
      "id": 10,
      "extras": null,
      "count": 1,
      "createdAt": "date",
      "item": {
        "id": 13,
        "name": "Wurst an Breze",
        "amount": 1,
        "unit": {
          "name": "Stk."
        },
        "category": {
          "name": "Speisen",
          "showAmount": false
        }
      }
    }];
    order.orderitems = items;
    const result = layout.deliveryNote(order)
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      'T3/Terrasse', '\n',
      'Bestellung', '\n',
      'Nr. 3', 'date', '\n',
      '\n',
      'Menge Artikel\n',
      '3 x Waffeln mit Sauerkraut\n',
      '1 x Wurst an Breze\n',
      '\n\n\n\n\n\n\n'
    ]);
  });

  it('should format deliveryNote with drinks', () => {
    const items = [{
      "id": 9,
      "extras": null,
      "count": 3,
      "item": {
        "name": "Fanta",
        "amount": 0.5,
        "unit": {
          "name": "l"
        },
        "category": {
          "name": "Alkoholfreies",
          "showAmount": true
        }
      }
    },{
      "extras": null,
      "count": 1,
      "createdAt": "date",
      "item": {
        "name": "Schnaps",
        "amount": 0.125,
        "unit": {
          "name": "cal"
        },
        "category": {
          "name": "Alkohol",
          "showAmount": true
        }
      }
    }];
    order.orderitems = items;
    const result = layout.deliveryNote(order)
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      'T3/Terrasse', '\n',
      'Bestellung', '\n',
      'Nr. 3', 'date', '\n',
      '\n',
      'Menge Artikel\n',
      '3 x Fanta 0.5l\n',
      '1 x Schnaps 1/8cal\n',
      '\n\n\n\n\n\n\n'
    ]);
  });

  it('should format deliveryNote with extra', () => {
    const items = [{
      "id": 9,
      "extras": 'lauwarm mit Lorem Ipsum dolor sit amin',
      "count": 3,
      "item": {
        "name": "Fanta",
        "amount": 0.5,
        "unit": {
          "name": "l"
        },
        "category": {
          "name": "Alkoholfreies",
          "showAmount": true
        }
      }
    }];
    order.orderitems = items;
    const result = layout.deliveryNote(order)
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      'T3/Terrasse', '\n',
      'Bestellung', '\n',
      'Nr. 3', 'date', '\n',
      '\n',
      'Menge Artikel\n',
      '3 x Fanta 0.5l\n       lauwarm mit Lorem Ipsum dolor sit amin\n',
      '\n\n\n\n\n\n\n'
    ]);
  });

  it('should format deliveryNote with two line extra', () => {
    const items = [{
      "id": 9,
      "extras": 'lauwarm mit Lorem Ipsum dolor sit amin tumor',
      "count": 3,
      "item": {
        "name": "Fanta",
        "amount": 0.5,
        "unit": {
          "name": "l"
        },
        "category": {
          "name": "Alkoholfreies",
          "showAmount": true
        }
      }
    }];
    order.orderitems = items;
    const result = layout.deliveryNote(order)
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      'T3/Terrasse', '\n',
      'Bestellung', '\n',
      'Nr. 3', 'date', '\n',
      '\n',
      'Menge Artikel\n',
      '3 x Fanta 0.5l\n       lauwarm mit Lorem Ipsum dolor sit amin t\n       umor\n',
      '\n\n\n\n\n\n\n'
    ]);
  });

  it('should format deliveryNote with three line extra', () => {
    const items = [{
      "id": 9,
      "extras": 'lauwarm mit Lorem Ipsum dolor sit amin tumor domo sapiens sid it muspi merol lorem ipsum',
      "count": 3,
      "item": {
        "name": "Fanta",
        "amount": 0.5,
        "unit": {
          "name": "l"
        },
        "category": {
          "name": "Alkoholfreies",
          "showAmount": true
        }
      }
    }];
    order.orderitems = items;
    const result = layout.deliveryNote(order)
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      'T3/Terrasse', '\n',
      'Bestellung', '\n',
      'Nr. 3', 'date', '\n',
      '\n',
      'Menge Artikel\n',
      '3 x Fanta 0.5l\n       lauwarm mit Lorem Ipsum dolor sit amin t\n       umor domo sapiens sid it muspi merol lor\n       em ipsum\n',
      '\n\n\n\n\n\n\n'
    ]);
  });
});

describe('should format tokenCoin', () => {
  it('should format 2 token coin', () => {
    const item = {
      "id": 9,
      "extras": null,
      "count": 2,
      "item": {
        "id": 33,
        "name": "Bier",
        "amount": 1,
        "unit": {
          "name": "Stk."
        },
        "category": {
          "name": "Speisen",
          "showAmount": false
        }
      }
    };
    const result = layout.tokenCoin(item, "GMBH")
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      '\n',
      'WERTMARKE FÜR', '\n',
      '\n',
      '\n',
      '\n',
      '1x BIER', '\n',
      '\n',
      '\n',
      'GMBH',
      '\n\n\n\n\n\n\n',
      '\n',
      'WERTMARKE FÜR', '\n',
      '\n',
      '\n',
      '\n',
      '1x BIER', '\n',
      '\n',
      '\n',
      'GMBH',
      '\n\n\n\n\n\n\n'
    ]);
  });

  it('should format 1 token coin', () => {
    const item = {
      "id": 9,
      "extras": null,
      "count": 1,
      "item": {
        "id": 33,
        "name": "Bier",
        "amount": 1,
        "unit": {
          "name": "Stk."
        },
        "category": {
          "name": "Speisen",
          "showAmount": false
        }
      }
    };
    const result = layout.tokenCoin(item, "GMBH")
      .filter((item) => {
        if(typeof item !== 'string') {
          return false;
        }
        return true;
      });
    assert.deepEqual(result, [
      '\n',
      'WERTMARKE FÜR', '\n',
      '\n',
      '\n',
      '\n',
      '1x BIER', '\n',
      '\n',
      '\n',
      'GMBH',
      '\n\n\n\n\n\n\n'
    ]);
  });
});
