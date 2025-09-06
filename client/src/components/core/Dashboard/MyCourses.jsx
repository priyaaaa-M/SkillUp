import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import CoursesTable from "../Dashboard/InstructorCourses/CoursesTable"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI.js"

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true)
                const result = await fetchInstructorCourses(token)
                if (result) {
                    setCourses(result)
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [token])

    // Calculate statistics
    const totalCourses = courses.length
    const publishedCourses = courses.filter(course => course.status === "Published").length
    const draftCourses = courses.filter(course => course.status === "Draft").length
    
    // Get unique student IDs across all courses
    const uniqueStudentIds = new Set()
    
    courses.forEach(course => {
      const students = course.studentsEnrolled || course.studentsEnroled || []
      students.forEach(student => {
        if (student._id) {
          uniqueStudentIds.add(student._id.toString())
        }
      })
    })
    
    // If no students data is available, use the sum of enrollmentCount as fallback
    const totalUniqueStudents = uniqueStudentIds.size > 0 
      ? uniqueStudentIds.size 
      : courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)

    return (
        <div className="p-8 bg-richblack-900 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-richblack-5 mb-2 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-200" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    My Courses
                </h1>
                <p className="text-richblack-200">Manage and create your course content</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700 hover:border-yellow-100 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-richblack-200">Total Courses</p>
                            <p className="text-2xl font-bold text-richblack-5">{totalCourses}</p>
                        </div>
                        <div className="p-3 bg-yellow-100/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700 hover:border-green-400 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-richblack-200">Published</p>
                            <p className="text-2xl font-bold text-white">{publishedCourses}</p>
                        </div>
                        <div className="p-3 bg-caribbeangreen-400/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 01118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700 hover:border-yellow-400 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-richblack-200">Drafts</p>
                            <p className="text-2xl font-bold text-yellow-600">{draftCourses}</p>
                        </div>
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700 hover:border-caribbeangreen-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-richblack-200">Total Students</p>
                            <p className="text-2xl font-bold text-caribbeangreen-300">{totalUniqueStudents.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-caribbeangreen-400/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-caribbeangreen-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-richblack-800 rounded-xl shadow-lg border border-richblack-700">
                <div>
                    <h2 className="text-xl font-semibold text-richblack-5 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Course List
                    </h2>
                    <p className="text-richblack-300 text-sm">Manage your courses and content</p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/add-course")}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-richblack-900 px-5 py-3 rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Course
                </button>
            </div>

            {/* Courses Table */}
            <div className="bg-richblack-800 rounded-xl shadow-lg border border-richblack-700 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-200"></div>
                    </div>
                ) : courses && courses.length > 0 ? (
                    <CoursesTable courses={courses} setCourses={setCourses} />
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-richblack-700 rounded-full mb-5 border border-richblack-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-richblack-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-richblack-5 mb-3">No courses yet</h3>
                        <p className="text-richblack-300 mb-7">Get started by creating your first course</p>
                        <button
                            onClick={() => navigate("/dashboard/add-course")}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-richblack-900 px-5 py-2.5 rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Your First Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyCourses