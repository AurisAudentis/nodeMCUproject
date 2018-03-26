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
const idSchema = mongoose.Schema({
    id : Number,
    type: Number
});

let unitModel = mongoose.model('Unit', nodeMCUSchema);
let messageModel = mongoose.model('Message', messageSchema);
let idModel = mongoose.model('Types', idSchema);
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
};

exports.saveMCUUnit = function saveMCUUnit(obj){
    let unit = new unitModel(obj);
    unit.save();
};

exports.reset = function reset(){
    unitModel.find({}, (err, units) => {
        units.forEach((unit) => {
            unit.remove();
        })
    });
};

exports.getType = function (id){
    idModel.find({}, (err, type) => {
        if(err) throw err;
        console.log(type);
        return type;
    });
};