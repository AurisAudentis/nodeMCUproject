const app = require('express')();
const bodyparser = require("body-parser");
const router = require("./router.js");
const TIMEOUT = 30000; //Checks if the last call was >30 s ago.
const datab = require("./mongo.js");
const cors = require("cors");
connectedNodes = [];

app.use(cors());
//This makes the incoming post requests readable
app.use(bodyparser.json());
//This routes the traffic to router.js
app.use("/nodeDEV", router);
app.use("/node", router);


setInterval(readServerMessages, 3000);
setTimeout(function(){
    datab.getType(1, function(type){
        console.log(type);
    });
    //console.log(datab.getType(1));
},5000);

/*
function checkNonResponding(){
    connectedNodes.forEach(function(item){
        if(item.lastcall > TIMEOUT){
            console.log("Haven't received a call from " + item.id + " in >30 seconds. Removing from consideration.");
            sendMessage(0, item.id, "terminated");
        }
    });
}
*/

function readServerMessages(){
    datab.schemaMessage.find({"toid":0, "isread":false}, function(err, messages) {
       // console.log("Reading messages");
        //console.log(messages);
            messages.forEach((message) => {
                if(message.message.startsWith("disconnected")){
                    toremoveid = (message.message.replace(/[^0-9]/g,''));
                    //console.log("cleaning up: " + parseInt(toremoveid));
                    (datab.schemaUnit.findOne({"id":parseInt(toremoveid.trim())}, function(err, unit){
                        if(unit != null){
                        unit.remove()
                        ;}
                    }))
                } else if(message.message.startsWith("reset")){
                    reset();
                }
                message.isread = true;
                message.save();
            });
    });
}

function reset(){
    datab.reset();
}


//wrapper for message sending.
function sendMessage(fromid, toid, message){
    let instance = new messageUnit(fromid, toid, message);
    console.log(instance);
    saveMessageUnit(instance); //Saves the message to db for read.
}


//Booting server
app.listen(8080, () => console.log('Listening.'));
