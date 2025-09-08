// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers
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
  updatePurchasedTogether,
} = require("../controllers/Course")

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

const {
  createRating,
  getAverageRating,
  getAllReviews,
} = require("../controllers/RatingAndReview")

const {
  updateCourseProgress,
} = require("../controllers/CourseProgress")

// Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")


// ----------------- Course routes -----------------

router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/editCourse", auth, isInstructor, editCourse)

router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)

router.post("/addSubSection", auth, isInstructor, createSubSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.get("/getAllCourses", getAllCourses)

router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

router.delete("/deleteCourse", auth, isInstructor, deleteCourse)

router.get("/popular", getPopularCourses)
router.get("/new", getNewCourses)
router.get("/top-by-category", getTopCoursesByCategory)
router.get("/frequently-bought/:courseId", getFrequentlyBoughtTogether)

router.post("/update-purchased-together", auth, isAdmin, async (req, res) => {
  try {
    const { courseIds } = req.body
    await updatePurchasedTogether(courseIds)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error updating purchased together:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})


// ----------------- Category routes -----------------

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)

router
  .route("/getCategoryPageDetails")
  .get(categoryPageDetails)
  .post(categoryPageDetails)


// ----------------- Rating & Review -----------------

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getAllReviews", getAllReviews)

module.exports = router
