import React from "react"
import { HiOutlineUserGroup, HiOutlineClock } from "react-icons/hi"  // react-icons
// (you can adjust icons if you want different style sets)

export default function CourseMeta({ course, formatDate }) {
  const totalLessons =
    course.courseContent?.reduce(
      (total, section) => total + (section?.subSection?.length || 0),
      0
    ) || 0

  return (
    <div className="flex gap-3 items-start">
      <img
        src={course?.thumbnail || "/default-thumbnail.png"}
        className="h-14 w-24 object-cover rounded-lg shadow-sm border border-richblack-600"
        alt={course.courseName || "Course Thumbnail"}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-richblack-5 text-sm truncate">
          {course.courseName}
        </h3>
        <p className="text-richblack-300 text-xs mt-1">
          {course.courseDescription?.slice(0, 60) || ""}
        </p>

        <div className="flex items-center gap-3 mt-2 text-xs text-richblack-400">
         
          <span className="flex items-center gap-1">
            <HiOutlineClock className="h-3 w-3" />
            {totalLessons} lessons
          </span>
        </div>

        <p className="text-richblack-500 text-xs mt-1">
          Created: {formatDate(course.createdAt)}
        </p>
      </div>
    </div>
  )
}








