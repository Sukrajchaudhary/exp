const mongoose= require("mongoose");
const {Schema}=mongoose;
const serviceSchema= new Schema({
    service:{
        type:String,
        require:true
    },
});

exports.Service = mongoose.model("Service", serviceSchema);