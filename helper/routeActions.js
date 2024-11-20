const mappingObj = require("../configs/dbActionMapping");

class Access{
    constructor(obj){
        if(!obj.moduleName || !Object.values(mappingObj).includes(obj.action)){
            throw new Error("Please pass all required parameters, or check your action correctly")
        }
        this.details = obj;
    }

    get moduleName(){
        return this.details.moduleName
    }
    
    get action(){
        return mappingObj[this.details.action];
    }

}


module.exports = Access;