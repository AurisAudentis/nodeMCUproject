const mongoose = require('mongoose');
const messageUnit = require('./MessageUnit.js');
mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;
const nodeMCUSchema = mongoose.Schema({
    id : Number,
    surrounding: Array
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


function saveMessageUnit(obj){
    let unit = new messageModel(obj);
    unit.save();
}
exports.schemaUnit = unitModel;
exports.schemaMessage = messageModel;

exports.sendMessage=function (fromid, toid, message){
    let instance = new messageUnit(fromid, toid, message);
    console.log(instance);
    saveMessageUnit(instance); //Saves the message to db for read.
}

exports.saveMCUUnit = function saveMCUUnit(obj){
    let unit = new unitModel(obj);
    unit.save();
}

