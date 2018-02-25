module.exports = function(id, ipaddress){
        return {
            "id": id,
            "ipaddress": ipaddress,
            "lastcall": Date.now()
        }
    };
