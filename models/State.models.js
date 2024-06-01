const mongoose = require("mongoose");
const { Schema } = mongoose;

const stateSchema = new Schema({
    state: {
        type: String,
        required: true 
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true 
    }
});

exports.State = mongoose.model("State", stateSchema);
