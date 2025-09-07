// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  getPopularCourses,
  getNewCourses,
  getTopCoursesByCategory,
  getFrequentlyBoughtTogether,
  updatePurchasedTogether
} = require("../controllers/Course")

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
  getAllReviews
} = require("../controllers/RatingandReview");
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/CourseProgress")
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")


//                                      Course routes

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)

// Get popular courses
router.get("/popular", getPopularCourses);

// Get new courses
router.get("/new", getNewCourses);

// Get top courses by category
router.get("/top-by-category", getTopCoursesByCategory);

// Get frequently bought together courses
router.get("/frequently-bought/:courseId", getFrequentlyBoughtTogether);

// Update purchased together (internal use)
router.post("/update-purchased-together", auth, isAdmin, async (req, res) => {
  try {
    const { courseIds } = req.body;
    await updatePurchasedTogether(courseIds);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
// Handle both GET and POST for category page details
router.route("/getCategoryPageDetails")
  .get(categoryPageDetails)
  .post(categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllReviews", getAllReviews);
//router.get("/getReviews", getAllRatingReview);

module.exports = router
