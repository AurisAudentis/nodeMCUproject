const express = require("express");
let router = express.Router();
let currentId = 1;
const nodeUnit = require("./NodeUnit.js");
const messageUnit = require("./MessageUnit.js");
const datab = require("./mongo.js");

//This assigns a temporary id
router.get("/id", function (req, res){
    res.send("" + currentId);
    console.log("distributed id: " + currentId);
    currentId +=1;
});


//This is for message post requests to the server
router.post("/:id/message", function(req, res){
    sendMessage(req.params.id, req.body.id, req.body.message);
    res.send("acknowledged");
});

//this gets availiable messages, if any
router.get("/:id/message", function(req, res){

    //database query for first unread message for id
    datab.schemaMessage.findOne({"toid":req.params.id, "isread":false}, function(err, message){

        //This responds the message if one, statuscode 204 if none
        if (message != null){
            res.send(message.message);
            //this removes the isread flag, so it won't come up another time
            message.isread = true;
            message.save();
            //saves the new isread state
        } else {
            res.status(204).end(); //nocontent status code
        }
    });
});



//initializes the node module, and saves an instance both in memory and database
router.post("/:id", function(req, res){
    console.log("Post request from:" + req.params.id);
    console.log("Post body:" + req.body.id + req.body.ipaddress);
    let instance = new nodeUnit(req.body.id, req.body.ipaddress);
    connectedNodes.push(instance);
    res.send("acknowledged");
    saveMCUUnit(instance);
});




//saves a unit to db

function saveMessageUnit(obj){
    let unit = new datab.schemaMessage(obj);
    unit.save();
}

function saveMCUUnit(obj){
    let unit = new unitModel(obj);
    unit.save();
}

function sendMessage(fromid, toid, message){
    let instance = new messageUnit(fromid, toid, message);
    console.log(instance);
    saveMessageUnit(instance); //Saves the message to db for read.
}

module.exports = router;