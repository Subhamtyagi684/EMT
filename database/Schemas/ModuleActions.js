const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const credentialModel = require("./Credential")
// const getPassword = require("../../../helper/generatePassword");
// const {expirePasswordInDays} = require("../../../configs/constants");
// id, lkupcode, brandcode, brandname, status, sortorder
const modulesActionSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Types.ObjectId,
        ref: "Module"
    },
    actions: [
        {
            type: ObjectId,
            ref: "Action"
        }
    ],
    updatedOn: {
        type: Date,
        default: function () {
            return new Date()
        }
    },
    createdOn: {
        type: Date,
        default: function () {
            return new Date()
        }
    }
});

// status -
// 1:"active"
// 2:"inactive"
// 3:"deactivated"
// 4:"hold"



module.exports = modulesActionSchema;