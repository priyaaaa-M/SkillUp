const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils")
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag: _tag,
			category,
			status,
			instructions: _instructions,
		} = req.body
		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage

		// Convert the tag and instructions from stringified Array to Array
		const tag = JSON.parse(_tag)
		const instructions = JSON.parse(_instructions)

		console.log("tag", tag)
		console.log("instructions", instructions)

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag.length ||
			!thumbnail ||
			!category ||
			!instructions.length
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			})
		}
		if (!status || status === undefined) {
			status = "Draft"
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		})

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			})
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category)
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			})
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		)
		console.log(thumbnailImage)
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions,
		})

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		)
		// Add the new course to the Categories
		const categoryDetails2 = await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		)
		console.log("HEREEEEEEEE", categoryDetails2)
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		})
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		})
	}
}
// Edit Course Details
exports.editCourse = async (req, res) => {
	try {
		const { courseId } = req.body
		const updates = req.body
		const course = await Course.findById(courseId)

		if (!course) {
			return res.status(404).json({ error: "Course not found" })
		}

		// If Thumbnail Image is found, update it
		if (req.files) {
			console.log("thumbnail update")
			const thumbnail = req.files.thumbnailImage
			const thumbnailImage = await uploadImageToCloudinary(
				thumbnail,
				process.env.FOLDER_NAME
			)
			course.thumbnail = thumbnailImage.secure_url
		}

		// Update only the fields that are present in the request body
		for (const key in updates) {
			if (updates.hasOwnProperty(key)) {
				if (key === "tag" || key === "instructions") {
					course[key] = JSON.parse(updates[key])
				} else {
					course[key] = updates[key]
				}
			}
		}

		await course.save()

		const updatedCourse = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec()

		res.json({
			success: true,
			message: "Course updated successfully",
			data: updatedCourse,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		})
	}
}
// Get Course List
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{ status: "Published" },
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
				category: true,
				status: true,
				description: true
			}
		)
		.populate("instructor")
		.populate({
		  path: 'category',
		  select: 'name description'
		})
		.exec()

		return res.status(200).json({
			success: true,
			data: allCourses,
		})
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: "Can't Fetch Course Data"
		});
	}
};

// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate("instructor")
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec();

//     //validation
//     if (!courseDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find the course with ${courseId}`,
//       });
//     }

//     //return response
//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body
		const courseDetails = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
					select: "-videoUrl",
				},
			})
			.populate({
				path: "studentsEnroled",
				select: "firstName lastName email image",
			})
			.exec()

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			})
		}

		// if (courseDetails.status === "Draft") {
		//   return res.status(403).json({
		//     success: false,
		//     message: `Accessing a draft course is forbidden`,
		//   });
		// }

		let totalDurationInSeconds = 0
		if (courseDetails.courseContent && Array.isArray(courseDetails.courseContent)) {
			courseDetails.courseContent.forEach((content) => {
				if (content.subSection && Array.isArray(content.subSection)) {
					content.subSection.forEach((subSection) => {
						if (subSection.timeDuration) {
							const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
							totalDurationInSeconds += timeDurationInSeconds
						}
					})
				}
			})
		}

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

		// Add enrollment count to the response
		const courseResponse = courseDetails.toObject();
		courseResponse.enrollmentCount = courseResponse.studentsEnroled?.length || 0;

		return res.status(200).json({
			success: true,
			data: {
				courseDetails: courseResponse,
				totalDuration,
			},
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}
exports.getFullCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body
		const userId = req.user.id
		
		console.log("Requested courseId:", courseId)
		console.log("Requested userId:", userId)
		
		// Validate courseId
		if (!courseId) {
			return res.status(400).json({
				success: false,
				message: "Course ID is required",
			})
		}
		
		// Validate if courseId is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(courseId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course ID format",
			})
		}
		
		const courseDetails = await Course.findOne({
			_id: courseId,
		})
			.populate({
				path: "instructor",
				populate: {
					path: "additionalDetails",
				},
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec()

		console.log("Found course details:", courseDetails ? "Yes" : "No")
		if (courseDetails) {
			console.log("Course instructor ID:", courseDetails.instructor._id)
			console.log("Requesting user ID:", userId)
		}

		// Check if user is enrolled in the course
		const user = await User.findById(userId).populate('courses')
		const isEnrolled = user.courses.some(course => course._id.toString() === courseId)

		// If user is not the instructor and not enrolled, deny access
		if (courseDetails.instructor._id.toString() !== userId && !isEnrolled) {
			return res.status(403).json({
				success: false,
				message: "You are not enrolled in this course",
			})
		}

		let courseProgressCount = await CourseProgress.findOne({
			courseID: courseId,
			userId: userId,
		})

		console.log("courseProgressCount:", courseProgressCount)

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			})
		}

		// if (courseDetails.status === "Draft") {
		//   return res.status(403).json({
		//     success: false,
		//     message: `Accessing a draft course is forbidden`,
		//   });
		// }

		let totalDurationInSeconds = 0
		if (courseDetails.courseContent && Array.isArray(courseDetails.courseContent)) {
			courseDetails.courseContent.forEach((content) => {
				if (content.subSection && Array.isArray(content.subSection)) {
					content.subSection.forEach((subSection) => {
						if (subSection.timeDuration) {
							const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
							totalDurationInSeconds += timeDurationInSeconds
						}
					})
				}
			})
		}

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos
					? courseProgressCount?.completedVideos
					: [],
			},
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}

// Get a list of Course for a given Instructor with enrollment stats
exports.getInstructorCourses = async (req, res) => {
	try {
		// Get the instructor ID from the authenticated user
		const instructorId = req.user.id

		// Find all courses belonging to the instructor with populated content and enrollment data
		const instructorCourses = await Course.find({
			instructor: instructorId,
		})
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.populate({
				path: "studentsEnroled",
				select: "firstName lastName email",
				model: "User"
			})
			.populate({
				path: "ratingAndReviews",
				select: "rating review user",
				populate: {
					path: "user",
					model: "User",
					select: "firstName lastName",
				},
			})
			.sort({ createdAt: -1 })

		// Calculate duration and statistics for each course
		const coursesWithStats = instructorCourses.map(course => {
			let totalDurationInSeconds = 0
			let totalRatings = 0
			let averageRating = 0
			
			// Calculate total duration
			if (course.courseContent && Array.isArray(course.courseContent)) {
				course.courseContent.forEach((content) => {
					if (content.subSection && Array.isArray(content.subSection)) {
						content.subSection.forEach((subSection) => {
							if (subSection.timeDuration) {
								const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
								totalDurationInSeconds += timeDurationInSeconds
							}
						})
					}
				})
			}

			// Calculate average rating
			if (course.ratingAndReviews && course.ratingAndReviews.length > 0) {
				totalRatings = course.ratingAndReviews.length
				const sumRatings = course.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0)
				averageRating = sumRatings / totalRatings
			}

			// Get enrollment count (using the pre-calculated field or fallback to array length)
			const enrollmentCount = course.enrollmentCount || (course.studentsEnroled ? course.studentsEnroled.length : 0)

			// Convert to plain object and add calculated fields
			const courseObj = course.toObject()
			courseObj.totalDuration = convertSecondsToDuration(totalDurationInSeconds)
			courseObj.enrollmentCount = enrollmentCount
			courseObj.averageRating = parseFloat(averageRating.toFixed(1))
			courseObj.totalRatings = totalRatings
			
			return courseObj
		})

		// Return the instructor's courses with stats
		res.status(200).json({
			success: true,
			data: coursesWithStats,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor courses",
			error: error.message,
		})
	}
}
// Get most popular courses
exports.getPopularCourses = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const courses = await Course.find({ status: 'Published' })
      .sort({ enrollmentCount: -1 })
      .limit(parseInt(limit))
      .populate('instructor', 'firstName lastName')
      .populate('category', 'name');

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch popular courses',
      error: error.message,
    });
  }
};

// Get newest courses
exports.getNewCourses = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const courses = await Course.find({ status: 'Published' })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .populate('instructor', 'firstName lastName')
      .populate('category', 'name');

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch new courses',
      error: error.message,
    });
  }
};

// Get top courses by category
exports.getTopCoursesByCategory = async (req, res) => {
  try {
    const { categoryId, limit = 5 } = req.query;
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required',
      });
    }

    const courses = await Course.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(categoryId), status: 'Published' } },
      { 
        $addFields: { 
          score: { 
            $add: [
              { $multiply: ["$ratingAndCount.averageRating", 0.7] },
              { $multiply: ["$enrollmentCount", 0.3] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'instructor',
          foreignField: '_id',
          as: 'instructor',
        },
      },
      { $unwind: '$instructor' },
      {
        $project: {
          'instructor.password': 0,
          'instructor.token': 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch top courses by category',
      error: error.message,
    });
  }
};

// Get frequently bought together courses
exports.getFrequentlyBoughtTogether = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 3 } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Sort by count and get top N
    const frequentlyBought = course.purchasedWith
      .sort((a, b) => b.count - a.count)
      .slice(0, parseInt(limit));

    // Get full course details
    const courseIds = frequentlyBought.map(item => item.courseId);
    const courses = await Course.find({
      _id: { $in: courseIds },
      status: 'Published'
    })
    .populate('instructor', 'firstName lastName')
    .populate('category', 'name');

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch frequently bought together courses',
      error: error.message,
    });
  }
};

// Update purchasedWith when courses are bought together
exports.updatePurchasedTogether = async (courseIds) => {
  try {
    // For each pair of courses in the purchase, update their purchasedWith arrays
    for (let i = 0; i < courseIds.length; i++) {
      for (let j = i + 1; j < courseIds.length; j++) {
        const course1 = courseIds[i];
        const course2 = courseIds[j];

        // Update course1's purchasedWith for course2
        await Course.updateOne(
          { _id: course1, 'purchasedWith.courseId': { $ne: course2 } },
          { $push: { purchasedWith: { courseId: course2 } } }
        );

        // Update count if already exists
        await Course.updateOne(
          { _id: course1, 'purchasedWith.courseId': course2 },
          { $inc: { 'purchasedWith.$.count': 1 } }
        );

        // Update course2's purchasedWith for course1
        await Course.updateOne(
          { _id: course2, 'purchasedWith.courseId': { $ne: course1 } },
          { $push: { purchasedWith: { courseId: course1 } } }
        );

        // Update count if already exists
        await Course.updateOne(
          { _id: course2, 'purchasedWith.courseId': course1 },
          { $inc: { 'purchasedWith.$.count': 1 } }
        );
      }
    }
  } catch (error) {
    console.error('Error updating purchased together:', error);
  }
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
	try {
		const { courseId } = req.body

		// Find the course
		const course = await Course.findById(courseId)
		if (!course) {
			return res.status(404).json({ message: "Course not found" })
		}

		// Unenroll students from the course
		const studentsEnrolled = course.studentsEnroled
		for (const studentId of studentsEnrolled) {
			await User.findByIdAndUpdate(studentId, {
				$pull: { courses: courseId },
			})
		}

		// Delete sections and sub-sections
		const courseSections = course.courseContent
		for (const sectionId of courseSections) {
			// Delete sub-sections of the section
			const section = await Section.findById(sectionId)
			if (section) {
				const subSections = section.subSection
				for (const subSectionId of subSections) {
					await SubSection.findByIdAndDelete(subSectionId)
				}
			}

			// Delete the section
			await Section.findByIdAndDelete(sectionId)
		}

		// Delete the course
		await Course.findByIdAndDelete(courseId)

		return res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		})
	}
}
