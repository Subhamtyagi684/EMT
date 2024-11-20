const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const emailSchema = new mongoose.Schema({
   emailMessageId: {
    type:String,
    required:true
   },
   emailResponse:{
    type:Object
   },
   userRef:{
    type:ObjectId,
    ref:"User"
   }
});



// module.exports = mongoose.model("EmailTransaction", emailSchema);