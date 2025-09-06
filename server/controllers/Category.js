const Category = require("../models/Category")

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" })
        }
        const CategorysDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(CategorysDetails)
        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.showAllCategories = async (req, res) => {
    try {
        const allCategorys = await Category.find()
        //console.log("Fetched categories:", allCategorys)   // 👈 yeh daal
        res.status(200).json({
            success: true,
            data: allCategorys,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.categoryPageDetails = async (req, res) => {
    try {
        console.log("Request body:", req.body)
        const { categoryId } = req.body || req.query; // Support both POST and GET

        if (!categoryId) {
            // If no categoryId is provided, return all published courses
            const allPublishedCourses = await Course.find({ status: "Published" })
                .populate({
                    path: "instructor",
                    select: "firstName lastName email image",
                })
                .populate({
                    path: "ratingAndReviews",
                    select: "rating review",
                })
                .select("courseName thumbnail price instructor ratingAndReviews studentsEnrolled")
                .exec();

            return res.status(200).json({
                success: true,
                data: {
                    selectedCategory: {
                        name: "All Courses",
                        description: "Browse all available courses",
                        courses: allPublishedCourses,
                    },
                    differentCategory: { courses: [] },
                    mostSellingCourses: allPublishedCourses.slice(0, 5), // Top 5 most viewed
                },
            });
        }

        // 🔹 Get courses for the selected category with proper populate
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    {
                        path: "instructor",
                        select: "firstName lastName email image", // ✅ instructor details
                    },
                    {
                        path: "ratingAndReviews",
                        select: "rating review", // ✅ rating & review details
                    },
                ],
                select:
                    "courseName thumbnail price instructor ratingAndReviews studentsEnrolled", // ✅ ensure required fields
            })
            .exec()

        if (!selectedCategory) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" })
        }

        if (selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // 🔹 Get courses from a random different category
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: [
                    {
                        path: "instructor",
                        select: "firstName lastName image",
                    },
                    {
                        path: "ratingAndReviews",
                        select: "rating review",
                    },
                ],
                select:
                    "courseName thumbnail price instructor ratingAndReviews studentsEnrolled",
            })
            .exec()

        // 🔹 Get top 10 selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                select:
                    "courseName thumbnail price instructor ratingAndReviews sold",
                populate: [
                    {
                        path: "instructor",
                        select: "firstName lastName image",
                    },
                    {
                        path: "ratingAndReviews",
                        select: "rating review",
                    },
                ],
            })
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // ✅ Final Response
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        console.error("Error in categoryPageDetails:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}
