const mongoose = require("mongoose");
const { Schema } = mongoose;
const businessSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
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
    verifyNumber: {
      type: String,
      default: "123456",
    },
    phone: {
      type: String,
      require: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"],
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

exports.Business = mongoose.model("Business", businessSchema);
