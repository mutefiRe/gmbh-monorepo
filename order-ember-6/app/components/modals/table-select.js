import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { storageFor } from 'ember-local-storage';

function filterCustomTable(orderitem) {
  return !(orderitem.count === 0) || orderitem.count !== orderitem.countPaid;
}

export default class ModalsTableSelectComponent extends Component {
  @service store;
  @service connection;
  @service i18n;
  @service notificationMessages;
  @service modal;
  tableStorage = storageFor('table');
  activeTab = 'tables';

  get userAreas() {
    return (this.args.areas || []).filter(area =>
      area.user?.id === this.args.currentUser?.id &&
      area.enabled &&
      !(area.tables?.[0]?.custom)
    );
  }

  get otherAreas() {
    return (this.args.areas || []).filter(area =>
      area.user?.id !== this.args.currentUser?.id &&
      area.enabled &&
      !(area.tables?.[0]?.custom)
    );
  }

  get unassignedTables() {
    return (this.args.tables || []).filter(table =>
      table.custom === false && !table.area?.id
    );
  }

  get customTables() {
    return (this.args.tables || []).filter(table =>
      table.custom ? table.orderitems.every(filterCustomTable) : false
    );
  }

  @action
  setTable(table) {
    if (this.args.order) {
      this.args.order.table = table;
    }
    this.modal.closeModal();
  }

  @action
  changeTab(tab) {
    this.activeTab = tab;
  }

  @action
  createTable() {
    if (!this.args.name) {
      this.notifications.error(this.i18n.t('notification.table.emptyString'), { autoClear: true });
      return;
    }
    const table = this.store.createRecord('table', { name: this.args.name, custom: true });
    if (this.connection.status) {
      this.saveTableAPI(table);
    } else {
      this.saveTableOffline(table);
    }
    if (this.args.setName) {
      this.args.setName('');
    }
    this.activeTab = 'tables';
  }

  saveTableAPI(table) {
    table.save().then(persistedTable => this.setTable(persistedTable));
    this.notifications.success(this.i18n.t('notification.table.success'), { autoClear: true });
  }

  saveTableOffline(table) {
    const serializedTable = table.serialize();
    serializedTable.id = table.id;
    this.tableStorage.addObject(serializedTable);
    this.setTable(table);
    this.notifications.success(this.i18n.t('notification.table.offline'), { autoClear: true });
  }
}
