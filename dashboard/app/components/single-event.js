import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    todaysDate: new Date(),
    name: 'Donutfest',
    beginDate: new Date(),
    endDate: new Date(),
    customTables: true,
    instantPay: false,
    showItemPrice: false,
    waiterAccess: false,
    receiptPrinter: 'Drucker',
    eventName: 'Eigentlich Kuchenfest',
    expiresTime: 72,
    actions: {
        toggleButton(prop, value) {
            var result = !value;
            this.set(prop, result);
        }
    }
});