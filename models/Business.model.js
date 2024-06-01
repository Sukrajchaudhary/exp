const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const businessSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
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
      // require: true,
    },
    businessName: {
      type: String,
      // required: true,
    },
    servicesInfo:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"State"
    },
    serviceOfBusiness:{
      type:String,
    }
  },
  { timestamps: true }
);
businessSchema.methods.generatesAccessToken = async function () {
  return jwt.sign({ id: this._id }, process.env.RefreshTokenSecret, {
    expiresIn: "2h",
  });
};
exports.Business = mongoose.model("Business", businessSchema);
