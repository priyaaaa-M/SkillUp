const mongoose = require("mongoose")

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
	courseName: { type: String, required: true },
	courseDescription: { type: String, required: true },
	status: {
		type: String,
		enum: ["Draft", "Published"],
		default: "Draft"
	},
	publishedAt: { 
		type: Date, 
		default: Date.now 
	},
	ratingAndCount: {
		averageRating: { type: Number, default: 0 },
		totalRatings: { type: Number, default: 0 }
	},
	enrollmentCount: { type: Number, default: 0 },
	purchasedWith: [{
		courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
		count: { type: Number, default: 1 }
	}],
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	whatYouWillLearn: {
		type: String,
	},
	courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
	ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
	price: {
		type: Number,
	},
	thumbnail: {
		type: String,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	studentsEnroled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	],
	instructions: {
		type: [String],
	},
	createdAt: { type: Date, default: Date.now },
})

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema)
