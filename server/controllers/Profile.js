const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils")
// Method for updating a profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
        } = req.body;

        const userId = req.user.id;
        
        // Input validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find the user and their profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user basic info
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        
        // Save the updated user
        await user.save();

        // Find and update the profile
        const profile = await Profile.findById(user.additionalDetails);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Update profile fields if they are provided
        if (about !== undefined) profile.about = about;
        if (contactNumber !== undefined) profile.contactNumber = contactNumber;
        if (gender !== undefined) profile.gender = gender;
        if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;

        // Save the updated profile
        await profile.save();

        // Get the updated user with populated profile
        const updatedUser = await User.findById(userId)
            .populate("additionalDetails")
            .select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails: updatedUser
        });

    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

exports.deleteAccount = async (req, res) => {
	try {
		const id = req.user.id
		console.log(id)
		const user = await User.findById({ _id: id })
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			})
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({
			_id: new mongoose.Types.ObjectId(user.additionalDetails),
		})
		for (const courseId of user.courses) {
			await Course.findByIdAndUpdate(
				courseId,
				{ $pull: { studentsEnroled: id } },
				{ new: true }
			)
		}
		// Now Delete User
		await User.findByIdAndDelete({ _id: id })
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		})
		await CourseProgress.deleteMany({ userId: id })
	} catch (error) {
		console.log(error)
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" })
	}
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .populate({
                path: 'courses',
                model: 'Course',
                select: 'courseName title _id',
            })
            .lean()
            .exec();
            
        console.log('User details with courses:', userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        console.error('Error in getAllUserDetails:', error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
	try {
		const displayPicture = req.files.displayPicture
		const userId = req.user.id
		const image = await uploadImageToCloudinary(
			displayPicture,
			process.env.FOLDER_NAME,
			1000,
			1000
		)
		console.log(image)
		const updatedProfile = await User.findByIdAndUpdate(
			{ _id: userId },
			{ image: image.secure_url },
			{ new: true }
		)
		res.send({
			success: true,
			message: `Image Updated successfully`,
			data: updatedProfile,
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

exports.getEnrolledCourses = async (req, res) => {
	try {
		const userId = req.user.id
		let userDetails = await User.findOne({
			_id: userId,
		})
			.populate({
				path: "courses",
				populate: {
					path: "courseContent",
					populate: {
						path: "subSection",
					},
				},
			})
			.exec()
		userDetails = userDetails.toObject()
		var SubsectionLength = 0
		for (var i = 0; i < userDetails.courses.length; i++) {
			let totalDurationInSeconds = 0
			SubsectionLength = 0
			for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
				totalDurationInSeconds += userDetails.courses[i].courseContent[
					j
				].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
				userDetails.courses[i].totalDuration = convertSecondsToDuration(
					totalDurationInSeconds
				)
				SubsectionLength +=
					userDetails.courses[i].courseContent[j].subSection.length
			}
			let courseProgressCount = await CourseProgress.findOne({
				courseID: userDetails.courses[i]._id,
				userId: userId,
			})
			courseProgressCount = courseProgressCount?.completedVideos.length
			if (SubsectionLength === 0) {
				userDetails.courses[i].progressPercentage = 100
			} else {
				// To make it up to 2 decimal point
				const multiplier = Math.pow(10, 2)
				userDetails.courses[i].progressPercentage =
					Math.round(
						(courseProgressCount / SubsectionLength) * 100 * multiplier
					) / multiplier
			}
		}

		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find user with id: ${userDetails}`,
			})
		}
		return res.status(200).json({
			success: true,
			data: userDetails.courses,
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

exports.instructorDashboard = async (req, res) => {
	try {
    console.log('Instructor dashboard endpoint hit')
    console.log('Authenticated user:', req.user)
    console.log('Fetching courses for instructor:', req.user.id)
    
    // Log the instructor ID we're querying with
    console.log('Querying courses for instructor ID:', req.user.id);
    
    // Find all courses for this instructor
    const courseDetails = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'firstName lastName email')
      .populate('studentsEnroled', '_id')
      .lean()
      .catch(err => {
        console.error('Error querying courses:', err);
        throw err;
      });
    
    console.log(`Found ${courseDetails.length} courses for instructor ${req.user.id}`);
    if (courseDetails.length > 0) {
      console.log('First course sample:', {
        _id: courseDetails[0]._id,
        courseName: courseDetails[0].courseName,
        instructor: courseDetails[0].instructor,
        status: courseDetails[0].status,
        studentsEnroled: courseDetails[0].studentsEnroled?.length || 0
      });
    }

    const allStudentIds = new Set();
    
    const courseData = courseDetails.map((course) => {
      console.log('Processing course:', course._id, course.courseName)
      
      // Ensure studentsEnroled exists and is an array
      const studentsEnrolled = Array.isArray(course.studentsEnroled) ? course.studentsEnroled : []
      const totalStudentsEnrolled = studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0)

      // Add student IDs to the set for unique count
      studentsEnrolled.forEach(student => {
        if (student && student._id) {
          allStudentIds.add(student._id.toString());
        }
      });

      // Create a new object with the required fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName || 'Unnamed Course',
        courseDescription: course.courseDescription || '',
        price: course.price || 0,
        thumbnail: course.thumbnail || '',
        status: course.status || 'Draft',
        instructor: course.instructor,
        studentsEnrolled: studentsEnrolled, // Include actual student references
        totalStudentsEnrolled,
        totalAmountGenerated,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }

      return courseDataWithStats
    })

    console.log(`Found ${allStudentIds.size} unique students across all courses`)
    console.log('Sending response with courses:', courseData.length)
    
    // Return both course data and unique student count
    res.status(200).json({
      courses: courseData,
      totalUniqueStudents: allStudentIds.size
    })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Server Error" })
	}
}
