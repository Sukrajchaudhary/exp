const mongoose = require("mongoose");
const { Schema } = mongoose;

const citySchema = new Schema({
    city: {
        type: String,
        required: true
    },
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true 
    }
});

exports.City = mongoose.model("City", citySchema);
