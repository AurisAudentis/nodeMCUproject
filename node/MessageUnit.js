module.exports = function(fromid, toid, message){
    return {
        "fromid": fromid,
        "toid": toid,
        "message":message,
        "isread":false,
        "timestamp": Date.now()
    }
};
