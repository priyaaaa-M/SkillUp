const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    phoneNo: {
        type: String,
        trim: true,
    },
    countrycode: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "resolved"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
