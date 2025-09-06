import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI.js"
import { COURSE_STATUS } from "../../../../utils/constants.js"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import CourseMeta from "./CourseMeta"

// ✅ React Icons
import { HiOutlineBookOpen, HiOutlineClock, HiOutlineUserGroup } from "react-icons/hi"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { MdOutlineLibraryBooks } from "react-icons/md"

const CoursesTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [confirmModal, setConfirmModal] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  // ✅ Optimized Delete Handler
  const handleCourseDelete = async (courseId) => {
    setActionLoading(courseId)
    const response = await deleteCourse({ courseId }, token)
    if (response) {
      setCourses((prev) => prev.filter((c) => c._id !== courseId))
    }
    setActionLoading(null)
    setConfirmModal(null)
  }

  // ✅ Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // ✅ Status Badge Styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
    switch (status) {
      case COURSE_STATUS.DRAFT:
        return `${baseClasses} bg-yellow-500/10 text-yellow-300 border border-yellow-500/30`
      case COURSE_STATUS.PUBLISHED:
        return `${baseClasses} bg-caribbeangreen-200/90 text-white border border-caribbeangreen-200`
      default:
        return `${baseClasses} bg-gray-500/10 text-gray-300 border border-gray-500/30`
    }
  }

  return (
    <div className="w-full">
      <Table className="w-full border border-richblack-700 rounded-lg overflow-hidden">
        <Thead>
          <Tr className="bg-richblack-700">
            <Th className="p-3 text-left text-sm font-medium text-richblack-50">
              Course
            </Th>
            <Th className="p-3 text-left text-sm font-medium text-richblack-50">
              Duration
            </Th>
            <Th className="p-3 text-left text-sm font-medium text-richblack-50">
              Students
            </Th>
            <Th className="p-3 text-left text-sm font-medium text-richblack-50">
              Status
            </Th>
            <Th className="p-3 text-left text-sm font-medium text-richblack-50">
              Actions
            </Th>
          </Tr>
        </Thead>

        <Tbody className="bg-richblack-800 divide-y divide-richblack-700">
          {courses.length === 0 ? (
            <Tr>
              <Td colSpan={5} className="px-4 py-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <MdOutlineLibraryBooks className="h-10 w-10 text-richblack-400 mb-2" />
                  <p className="text-richblack-200 text-sm font-medium">
                    No courses found
                  </p>
                  <p className="text-richblack-400 text-xs">
                    Create your first course to get started
                  </p>
                </div>
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="hover:bg-richblack-700 transition-colors duration-150"
              >
                {/* --- Course Details --- */}
                <Td className="p-3">
                  <CourseMeta course={course} formatDate={formatDate} />
                </Td>

                {/* --- Duration --- */}
                <Td className="p-3 text-sm text-richblack-200">
                  {course.totalDuration || "N/A"}
                </Td>
                <Td className="p-3 text-sm text-richblack-200">
                  <div className="flex items-center gap-1">
                    <HiOutlineUserGroup className="text-yellow-100" />
                    {course.enrollmentCount || (course.studentsEnroled?.length || 0)} students
                  </div>
                </Td>
                <Td className="p-3">
                  <div className={getStatusBadge(course.status)}>
                    {course.status === COURSE_STATUS.PUBLISHED && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {course.status === COURSE_STATUS.DRAFT && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="capitalize">{course.status.toLowerCase()}</span>
                  </div>
                </Td>

                {/* --- Actions --- */}
                <Td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }
                      aria-label={`Edit ${course.courseName}`}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition-colors duration-200 disabled:opacity-50"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        setConfirmModal({
                          text1: "Delete Course?",
                          text2:
                            "Are you sure you want to delete this course? This action cannot be undone.",
                          btn1Text:
                            actionLoading === course._id
                              ? "Deleting..."
                              : "Delete",
                          btn2Text: "Cancel",
                          btn1Handler:
                            actionLoading !== course._id
                              ? () => handleCourseDelete(course._id)
                              : null,
                          btn2Handler:
                            actionLoading !== course._id
                              ? () => setConfirmModal(null)
                              : null,
                        })
                      }
                      disabled={actionLoading === course._id}
                      aria-label={`Delete ${course.courseName}`}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs bg-pink-400/20 text-pink-300 rounded-lg hover:bg-pink-400/30 transition-colors duration-200 disabled:opacity-50"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* --- Confirmation Modal --- */}
      {confirmModal && <ConfirmationModal modalData={confirmModal} isOpen />}
    </div>
  )
}

export default CoursesTable
