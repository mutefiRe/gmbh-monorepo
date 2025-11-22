export default function() {

  this.urlPrefix = 'http://localhost:8080';    // make this `http://localhost:8080`, for example, if your API is on a different server
  this.timing = 400;      // delay for each request, automatically set to 0 during testing

  this.post('/authenticate', () => {
    return {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiMTIzNDU2Nzg5MCIsImxhc3RuYW1lIjoiSm9obiBEb2UiLCJ1c2VybmFtZSI6IndhaXRlcl8xIiwicGFzc3dvcmQiOiJhYmMiLCJwZXJtaXNzaW9uIjoxLCJwcmludGVyIjoidGVzdCJ9.i_QVYHeQ0z52hgD2tdNjxBU-FnCIC5kJE6U97Ozvi2g"};
  });

  this.namespace = 'api';    // make this `api`, for example, if your API is namespaced

  this.get('/areas');
  this.get('/categories');
  this.get('/items');
  this.get('/orders');
  this.get('/settings');
  this.get('/tables');
  this.get('/units');
  this.get('/units');
  this.get('/users/:id');

  // statistics mock response
  this.get('/statistics/most-sold-products', () => {
    return {"data":{"labels":["Kn\u00f6del mit Breze","Leberkassemmel in Pommes","Frankfurter in Sauerkraut"],"datasets":[{"data":[2,2,2],"backgroundColor":["#009493","#da3f71","#b1723b"]}]},"options":{"responsive":true,"title":{"display":true,"text":"Top 10 der umsatzst\u00e4rksten Produkte"},"legend":{"display":false},"scales":{"xAxes":[{"display":true,"scaleLabel":{"display":false}}],"yAxes":[{"display":true,"scaleLabel":{"display":true,"labelString":"Umsatz in Euro"}}]}}};
  });
  this.get('/statistics/sales', () => {
    return {"sales":36};
  });
  this.get('/statistics/sales-hour', () => {
    return {"data":{"labels":["16:00"],"datasets":[{"fill":false,"borderColor":"#009493","backgroundColor":"#009493","data":[36],"label":"05.28"}]},"options":{"responsive":true,"title":{"display":true,"text":"Umsatz pro Stunde"},"legend":{"display":true},"scales":{"xAxes":[{"display":true,"scaleLabel":{"display":false}}],"yAxes":[{"display":true,"scaleLabel":{"display":true,"labelString":"Umsatz in Euro"}}]}}};
  });
  this.get('/statistics/sales-today', () => {
    return {"createdAt":"2017-05-28T14:12:41.000Z","sales":36};
  });
  this.get('/statistics/top-selling-products', () => {
    return  {"data":{"labels":["Frankfurter in Sauerkraut","Leberkassemmel in Pommes","Kn\u00f6del mit Breze"],"datasets":[{"data":[30,4,2],"backgroundColor":["#009493","#da3f71","#b1723b"]}]},"options":{"responsive":true,"title":{"display":true,"text":"Top 10 der verkaufsst\u00e4rksten Produkte"},"legend":{"display":false},"scales":{"xAxes":[{"display":true,"scaleLabel":{"display":false}}],"yAxes":[{"display":true,"scaleLabel":{"display":true,"labelString":"Stk."}}]}}};
  });
}
