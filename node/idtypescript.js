const db = connect("mongodb://localhost:27017/test");

db.types.remove({});


db.types.insert({id:1, type:1});
db.types.insert({id:2, type:2});