import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../../utils/constants.js"
import { useNavigate } from "react-router-dom"

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(course?.status === COURSE_STATUS.PUBLISHED)
  const publishedValue = watch("published")

  // ✅ Pre-fill checkbox if course already published
  useEffect(() => {
    if (COURSE_STATUS.PUBLISHED === course?.status) {
      setValue("published", true)
      setIsPublished(true)
    }
  }, [course, setValue])

  // ✅ Go back to step 2
  const goBack = () => {
    dispatch(setStep(2))
  }

  // ✅ Redirect to course page after publishing
  const goToCourse = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  // ✅ Handle Publish/Unpublish
  const handleCoursePublish = async () => {
    // Check current status
    if (course?.status === COURSE_STATUS.PUBLISHED && getValues("published") === true) {
      // Already published, just redirect
      goToCourse()
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("published")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)

    setLoading(true)
    const result = await editCourseDetails(formData, token)
    setLoading(false)

    if (result) {
      setIsPublished(courseStatus === COURSE_STATUS.PUBLISHED)
      goToCourse()
    }
  }

  // ✅ React Hook Form onSubmit
  const onSubmit = () => {
    handleCoursePublish()
  }

  return (
    <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-yellow-100/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-richblack-5">Publish Course</h2>
      </div>

      {/* Status Indicator */}
      <div className="bg-richblack-700 p-4 rounded-lg mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isPublished ? 'bg-green-400/20' : 'bg-yellow-400/20'}`}>
            {isPublished ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-medium text-richblack-5 text-sm">
              {isPublished ? 'Published' : 'Draft Mode'}
            </p>
            <p className="text-richblack-300 text-xs">
              {isPublished
                ? 'Visible to students'
                : 'Not visible to students yet'
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Publishing Option */}
        <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
          <label htmlFor="published" className="flex items-start gap-3 cursor-pointer">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                className="h-4 w-4 text-yellow-400 border-richblack-500 rounded focus:ring-yellow-400 focus:ring-offset-richblack-700 bg-richblack-600"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-richblack-5 text-sm">
                Make this course public
              </p>
              <p className="text-richblack-300 text-xs mt-1">
                Check to publish and make visible to students
              </p>
            </div>
          </label>
        </div>

        {/* Success Message */}
        {publishedValue && (
          <div className="bg-green-400/10 p-3 rounded-lg border border-green-400/20">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-green-400 text-sm">Ready to publish!</p>
                <p className="text-green-300 text-xs mt-1">
                  Your course meets all requirements
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-richblack-700">
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-richblack-700 text-richblack-200 rounded-lg hover:bg-richblack-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-richblack-900 rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-richblack-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {publishedValue ? 'Publish Course' : 'Save as Draft'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PublishCourse