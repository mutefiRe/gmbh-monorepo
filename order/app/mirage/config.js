export default function() {
  this.get('/users', function() {
    return {
      data: [{
        type: "user",
        id: 1,
        attributes: {
          "first-name": "Alexander",
          "last-name": "Gabriel",
          "password": "******",
          "token": "token"
        },
        relationships: {
          "role": {
            "data": {"id": 1, "type": "role"}
          }
        }
      },{
        type: "user",
        id: 2,
        attributes: {
          "first-name": "Sebastian",
          "last-name": "Huber",
          "password": "******",
          "token": "token"
        },
        relationships: {
          "role": {
            "data": {"id": 2, type: "role"}
          }
        }
      }],
      included: [
      {
        "type": "role",
        "id": 2,
        "attributes": {
          "name": "Kellner"
        }
      },{
        "type": "role",
        "id": 1,
        "attributes": {
          "name": "Admin"
        }
      },{
        "type": "role",
        "id": 3,
        "attributes": {
          "name": "Lagerist"
        }
      }
      ]
    };
  });
}
