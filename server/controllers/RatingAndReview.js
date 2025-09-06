const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const User = require("../models/User");
const { mongo, default: mongoose } = require("mongoose");

//createRating
exports.createRating = async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Authenticated user:', req.user);

        if (!req.user || !req.user.id) {
            console.error('User not authenticated or user ID not found');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Get user id
        const userId = req.user.id;
        
        // Fetch data from req body
        const { rating, review, courseId } = req.body;

        // Validate required fields
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        if (rating === undefined || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid rating between 1 and 5',
            });
        }
        // Temporary: Bypass enrollment check for debugging
        console.log('Bypassing enrollment check for debugging');
        
        // Log and validate course ID
        console.log('Received courseId:', courseId, 'Type:', typeof courseId);
        
        // Verify course exists
        let course;
        try {
            course = await Course.findById(courseId);
            console.log('Found course:', course ? course._id : 'Not found');
            
            if (!course) {
                // Try finding without casting to ObjectId
                course = await Course.findOne({ _id: courseId });
                console.log('Alternative course lookup result:', course ? 'Found' : 'Not found');
                
                if (!course) {
                    // List all courses for debugging
                    const allCourses = await Course.find({}).select('_id title').limit(5);
                    console.log('First 5 courses in DB:', allCourses);
                    
                    return res.status(404).json({
                        success: false,
                        message: `Course not found. ID: ${courseId}`,
                        courseIdType: typeof courseId,
                        sampleCourses: allCourses
                    });
                }
            }
        } catch (error) {
            console.error('Error finding course:', error);
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID format',
                error: error.message
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                user:userId,
                                                course:courseId,
                                            });
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Course is already reviewed by the user',
                    });
                }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                        rating, review, 
                                        course:courseId,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        }
                                    },
                                    {new: true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



/**
 * Get average rating and reviews for a course
 * Query params: courseId (required)
 */
exports.getAverageRating = async (req, res) => {
    try {
        // Get course ID from query params
        const { courseId } = req.query;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        // Validate course ID format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format',
            });
        }

        // Calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        // Get reviews with user details
        const reviews = await RatingAndReview.find({ course: courseId })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .sort({ createdAt: -1 });

        // Prepare response data
        const responseData = {
            success: true,
            reviews: reviews || [],
            averageRating: 0,
            totalRatings: 0,
        };

        if (result.length > 0) {
                responseData.averageRating = parseFloat(result[0].averageRating.toFixed(1));
                responseData.totalRatings = result[0].totalRatings;
            }
            
            return res.status(200).json(responseData);
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


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
            data: reviews,
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

// Get all ratings and reviews
exports.getAllRating = async (req, res) => {
    try {
        const { courseId } = req.query;
        
        // Build query object
        const query = {};
        if (courseId) {
            query.course = courseId;
        }
        
        const allReviews = await RatingAndReview.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
            
        return res.status(200).json({
            success: true,
            message: courseId 
                ? "Course reviews fetched successfully" 
                : "All reviews fetched successfully",
            reviews: allReviews,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reviews",
        });
    }
};