const app = require('express')();
const bodyparser = require("body-parser");
const router = require("./router.js");
const TIMEOUT = 30000; //Checks if the last call was >30 s ago.
connectedNodes = [];


//This makes the incoming post requests readable
app.use(bodyparser.json());
//This routes the traffic to router.js
app.use("/nodeDEV", router);
app.use("/node", router);


function checkNonResponding(){
    connectedNodes.forEach(function(item){
        if(item.lastcall > TIMEOUT){
            console.log("Haven't received a call from " + item.id + " in >30 seconds. Removing from consideration.");
            sendMessage(0, item.id, "terminated");
        }
    });
}


function readServerMessages(){
    datab.schemaMessage.find({"toid":0, "isread":false}, function(err, messages) {
            messages.forEach(message, function(){

            });
    });
}


//wrapper for message sending.
function sendMessage(fromid, toid, message){
    let instance = new messageUnit(fromid, toid, message);
    console.log(instance);
    saveMessageUnit(instance); //Saves the message to db for read.
}


//Booting server
app.listen(27030, () => console.log('Listening.'));
