const mongoose = require("mongoose")
const User = require("../models/User")
const Course = require("../models/Course")
const Category = require("../models/Category")

// Example: Create Course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, category, _tag, _instructions } = req.body
    const userId = req.user.id

    // 1. Validate Instructor
    const instructorDetails = await User.findOne({
      _id: userId,
      accountType: "Instructor",
    })
    if (!instructorDetails) {
      return res.status(403).json({ success: false, message: "Instructor not found" })
    }

    // 2. Validate Category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" })
    }

    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" })
    }

    // 3. Parse Tags & Instructions safely
    const tag = typeof _tag === "string" ? JSON.parse(_tag) : _tag
    const instructions = typeof _instructions === "string" ? JSON.parse(_instructions) : _instructions

    // 4. Validate Thumbnail
    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({ success: false, message: "Thumbnail image is required" })
    }

    // Thumbnail upload logic yaha likhna (Cloudinary)

    // 5. Create Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      category,
      tag,
      instructions,
      // thumbnail: uploadedFileUrl
    })

    res.status(201).json({ success: true, data: newCourse })
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
}
