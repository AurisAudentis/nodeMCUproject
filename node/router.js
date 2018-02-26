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
    datab.sendMessage(req.params.id, req.body.id, req.body.message);
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
   // connectedNodes.push(instance);
    res.send("acknowledged");
    datab.saveMCUUnit(instance);
});

module.exports = router;