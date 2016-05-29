export default function (server) {
  server.createList('user', 10);
  server.createList('category', 5);
  server.createList('item', 20);
  server.createList('unit', 20);
}
