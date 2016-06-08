export default function (server) {
  server.create('user', {admin: 0, username: 'admin', firstname: 'admin', lastname: 'admin'});
  server.create('user', {admin: 1, username: 'waiter', firstname: 'waiter', lastname: 'waiter'});

  const items = server.createList('item', 10);

  server.createList('item', 50);
  server.createList('category', 4, {items});
  server.createList('user', 18);
  server.createList('area', 10);
  server.createList('order', 10);
  server.createList('orderitem', 10);
  server.createList('table', 10);
  server.createList('unit', 10);
}
