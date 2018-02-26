module.exports = function(id, array){
        return {
            "id": id,
            "surrounding": array,
            "lastcall": Date.now()
        }
    };
