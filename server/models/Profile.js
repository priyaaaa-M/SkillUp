const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
	coursesEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		}
	],
	coursesInProgress: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		}
	],
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);