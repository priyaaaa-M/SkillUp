const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// Get all reviews with user and course details
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await RatingAndReview.find({})
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName thumbnail",
            })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(20); // Limit to 20 most recent reviews

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        console.error("Error fetching all reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
};
