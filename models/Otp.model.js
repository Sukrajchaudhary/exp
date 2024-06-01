const mongoose= require("mongoose");
const {Schema}=mongoose;

const otpSchema=new Schema({
    OTP: {
        type: String,
        require: true,
      },
      OTPExp: {
        type: Date,
        default: Date.now,
        get: (OTPExp) => OTPExp.getTime(),
        set: (OTPExp) => new Date(OTPExp),
      },
      phone: {
        type: String,
       require:true
      },
},{timestamps:true});

exports.OTPModel=mongoose.model("OTPModel",otpSchema);