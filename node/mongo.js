const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;
const nodeMCUSchema = mongoose.Schema({
    id : Number,
    ipaddress : String
});
const messageSchema = mongoose.Schema({
    fromid : Number,
    toid : Number,
    message : String,
    isread : Boolean
});
let unitModel = mongoose.model('Unit', nodeMCUSchema);
let messageModel = mongoose.model('Message', messageSchema);
db.once('open', function(){
    console.log("Mongoose connection established.");
});

exports.schemaUnit = unitModel;
exports.schemaMessage = messageModel;

