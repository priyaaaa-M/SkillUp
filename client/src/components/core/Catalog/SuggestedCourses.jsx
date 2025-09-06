import React, { useEffect, useState } from "react"
import { apiConnector } from "../../../services/apiconnector"
import { categories } from "../../../services/apis"
import Course_Card from "./Course_Card"

export default function SuggestedCourses({ message, categoryId }) {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [allCategories, setAllCategories] = useState([])

    useEffect(() => {
        ; (async () => {
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                const allCats = res?.data?.data || []
                setAllCategories(allCats)

                // Jo categoryId props se mila, usko select karo
                const matched = allCats.find((cat) => cat._id === categoryId)
                setSelectedCategory(matched || null)
            } catch (error) {
                console.log("Could not fetch categories for suggestions.", error)
            }
        })()
    }, [categoryId])

    // Agar abhi tak category load nahi hui
    if (!selectedCategory) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    // Filter karke koi dusri category le lo suggestion ke liye
    const otherCategories = allCategories.filter(
        (cat) => cat._id !== selectedCategory._id
    )

    // Unme se ek category choose karo (yaha pe pehla le liya)
    const suggestedCategory =
        otherCategories.length > 0 ? otherCategories[0] : null

    return (
        <div className="box-content bg-richblack-800 px-4">
            {/* Hero Section */}
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className="text-sm text-richblack-300">
                    {`Home / Catalog / `}
                    <span className="text-yellow-25">{selectedCategory?.name}</span>
                </p>
                <p className="text-3xl text-richblack-5">{selectedCategory?.name}</p>
                <p className="max-w-[870px] text-richblack-200">
                    {selectedCategory?.description}
                </p>
            </div>

            {/* No Courses Message */}
            <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
                <h2 className="text-2xl font-semibold text-richblack-5">{message}</h2>
                <p className="text-richblack-200">
                    Check out these courses from a similar category:
                </p>

                {/* Suggested Courses */}
                {suggestedCategory && suggestedCategory.courses?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {suggestedCategory.courses.slice(0, 6).map((course) => (
                            <Course_Card
                                key={course._id}
                                course={course}
                                Height={"h-[400px]"}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-richblack-400">
                        No suggestions available at the moment.
                    </p>
                )}
            </div>
        </div>
    )
}
