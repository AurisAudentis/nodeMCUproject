const express = require("express");
let router = express.Router();
let currentId = 1;
const nodeUnit = require("./NodeUnit.js");
const messageUnit = require("./MessageUnit.js");
const datab = require("./mongo.js");
/*
//This assigns a temporary id
router.get("/id", function (req, res){
    res.send("" + currentId);
   // console.log("distributed id: " + currentId);
    currentId +=1;
});

*/
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
    //console.log("Post request from:" + req.params.id);
   // console.log("Post body:" + req.body.id + req.body.surrounding);
    let instance = new nodeUnit(req.body.id, req.body.surrounding);
    datab.schemaUnit.findOne({"id":req.params.id}, function(err, unit){

        //This responds the message if one, statuscode 204 if none
        if (unit != null){

            //this removes the isread flag, so it won't come up another time
            unit.surrounding = req.body.surrounding;
            unit.save();
            //saves the new isread state
        } else {
            datab.saveMCUUnit(instance);
        }
        res.send("acknowledged");
    });
});

router.get("/", function(req, res){
   datab.schemaUnit.find({}, function(err, units){
       //console.log(units);
       res.send(units);
   });
});

router.get("/raw", (req, res) => {
    datab.schemaUnit.find({}, (err, units)=> {
       let answer = "";
        units.forEach((unit) => {
          answer += "id: " + unit.id;
          answer += "surrounding: " + unit.surrounding + ";"
       });
        res.send(answer);

    });
});
module.exports = router;