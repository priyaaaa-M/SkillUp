const mongoose = require("mongoose");
require("dotenv").config();

// Import all models to ensure they're registered
require("../models/index");

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("DB Connected Successfully");
        
        // Verify model registration
        const models = mongoose.modelNames();
        console.log("Registered models:", models);
        
    } catch (error) {
        console.error("DB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};