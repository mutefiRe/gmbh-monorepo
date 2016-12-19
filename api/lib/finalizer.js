'use strict';

function finalizer(req, res){
  const body = mapIds(res);
  const io = req.app.get('io');

  if (res.socket === "update") io.sockets.emit("update", body);
  res.send(body);
}

module.exports = finalizer;

function mapIds(res){
  const body = res.body;
  const firstKey = Object.keys(body)[0];
  const first = body[firstKey];
  if (Array.isArray(first)){
    for (const second of first) mapKeys(second);
  } else {
    mapKeys(first);
  }
  return body;
}

function flatten(a){
  return a.map(x => x.id);
}

function mapKeys(object){
  for (const key in object){
    if (Array.isArray(object[key])){
      object[key] = flatten(object[key]);
    } else if (isId(key)) {
      object[key.slice(0, key.length - 2)] = object[key];
      delete object[key];
    }
  }
  return object;
}

function isId(key){
  return key.slice(key.length - 2, key.length) === "Id";
}
