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
        console.log('Fetching all published courses...');
        
        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnroled: true,  // Fixed field name to match model
                category: true,
                status: true,
                courseDescription: true, // Changed from description to courseDescription
                whatYouWillLearn: true,
                ratingAndCount: true,
                enrollmentCount: true,
                createdAt: true
            }
        )
        .populate({
            path: 'instructor',
            select: 'firstName lastName image'
        })
        .populate({
            path: 'category',
            select: 'name description'
        })
        .populate({
            path: 'ratingAndReviews',
            select: 'rating review user createdAt',
            populate: {
                path: 'user',
                select: 'firstName lastName image'
            }
        })
        .lean()
        .exec();

        console.log(`Found ${allCourses.length} published courses`);
        
        return res.status(200).json({
            success: true,
            data: allCourses,
            message: 'Courses fetched successfully'
        });
        
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        console.log('getCourseDetails called with request body:', req.body);
        const { courseId } = req.body;
        
        if (!courseId) {
            console.error('No courseId provided in request body');
            return res.status(400).json({
                success: false,
                message: 'Course ID is required',
            });
        }

        // Validate courseId format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            console.error('Invalid courseId format:', courseId);
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID format',
            });
        }
        
        console.log('Looking up course with ID:', courseId);
        const courseDetails = await Course.findOne({
            _id: courseId,
            status: 'Published' // Only fetch published courses
        })
        .populate({
            path: 'instructor',
            select: 'firstName lastName email image additionalDetails',
            populate: {
                path: 'additionalDetails',
                select: 'about contactNumber'
            }
        })
        .populate({
            path: 'category',
            select: 'name description'
        })
        .populate({
            path: 'ratingAndReviews',
            select: 'rating review user createdAt',
            populate: {
                path: 'user',
                select: 'firstName lastName image'
            }
        })
        .populate({
            path: 'courseContent',
            select: 'sectionName subSection',
            populate: {
                path: 'subSection',
                select: 'title description timeDuration'
            }
        })
        .populate({
            path: 'studentsEnroled',
            select: 'firstName lastName email image',
            options: { limit: 10 } // Limit the number of enrolled students to return
        })
        .lean()
        .exec();

        if (!courseDetails) {
            console.error(`Course not found with ID: ${courseId}`);
            return res.status(404).json({
                success: false,
                message: 'Course not found or not published',
            });
        }

        // Calculate total duration and get enrollment count
        let totalDurationInSeconds = 0;
        let totalLectures = 0;
        const enrollmentCount = courseDetails.studentsEnroled ? courseDetails.studentsEnroled.length : 0;
        
        if (courseDetails.courseContent && Array.isArray(courseDetails.courseContent)) {
            courseDetails.courseContent.forEach((section) => {
                if (section.subSection && Array.isArray(section.subSection)) {
                    section.subSection.forEach((lecture) => {
                        totalLectures++;
                        if (lecture.timeDuration) {
                            const timeDurationInSeconds = parseInt(lecture.timeDuration) || 0;
                            totalDurationInSeconds += timeDurationInSeconds;
                        }
                    });
                }
            });
        }

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        
        // Calculate average rating
        let averageRating = 0;
        if (courseDetails.ratingAndReviews && courseDetails.ratingAndReviews.length > 0) {
            const totalRatings = courseDetails.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = totalRatings / courseDetails.ratingAndReviews.length;
        }

        // Prepare the response object
        // Get instructor's total courses count and enrolled students count
        let instructorCoursesCount = 0;
        let totalEnrolledStudents = 0;
        
        if (courseDetails.instructor?._id) {
            // Get count of all published courses by this instructor
            instructorCoursesCount = await Course.countDocuments({
                instructor: courseDetails.instructor._id,
                status: 'Published'
            });
            
            // Get total number of students enrolled in all courses by this instructor
            const instructorCourses = await Course.find({
                instructor: courseDetails.instructor._id,
                status: 'Published'
            }).select('studentsEnroled');
            
            // Use a Set to count unique students across all courses
            const uniqueStudents = new Set();
            instructorCourses.forEach(course => {
                if (course.studentsEnroled && course.studentsEnroled.length > 0) {
                    course.studentsEnroled.forEach(studentId => {
                        uniqueStudents.add(studentId.toString());
                    });
                }
            });
            totalEnrolledStudents = uniqueStudents.size;
            
            console.log(`Instructor ${courseDetails.instructor._id} has ${instructorCoursesCount} courses and ${totalEnrolledStudents} unique students`);
        }

        const courseResponse = {
            ...courseDetails,
            totalDuration,
            totalLectures,
            averageRating: parseFloat(averageRating.toFixed(1)),
            enrollmentCount: courseDetails.studentsEnroled ? courseDetails.studentsEnroled.length : 0,
            instructor: courseDetails.instructor ? {
                _id: courseDetails.instructor._id,
                firstName: courseDetails.instructor.firstName,
                lastName: courseDetails.instructor.lastName,
                image: courseDetails.instructor.image,
                about: courseDetails.instructor.additionalDetails?.about || '',
                contactNumber: courseDetails.instructor.additionalDetails?.contactNumber || '',
                email: courseDetails.instructor.email || '',
                totalCourses: instructorCoursesCount || 0,
                totalStudents: totalEnrolledStudents || 0
            } : null,
            ratingAndReviews: courseDetails.ratingAndReviews ? courseDetails.ratingAndReviews.map(review => ({
                ...review,
                user: {
                    _id: review.user?._id,
                    firstName: review.user?.firstName,
                    lastName: review.user?.lastName,
                    image: review.user?.image
                }
            })) : []
        };

        // Clean up the response
        delete courseResponse.__v;
        delete courseResponse.studentsEnroled; // We'll send only the count, not the full list

        console.log(`Successfully fetched course details for ID: ${courseId}`);
		courseResponse.enrollmentCount = courseResponse.studentsEnroled?.length || 0;

        return res.status(200).json({
            success: true,
            data: {
                courseDetails: {
                    ...courseDetails,
                    enrollmentCount,
                },
                totalDuration: convertSecondsToDuration(totalDurationInSeconds),
                totalLectures,
                instructorStats: {
                    totalCourses: instructorCoursesCount,
                    totalStudents: totalEnrolledStudents,
                    instructorId: courseDetails.instructor?._id
                }
            },
        });
    } catch (error) {
        console.error('Error in getCourseDetails:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch course details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
