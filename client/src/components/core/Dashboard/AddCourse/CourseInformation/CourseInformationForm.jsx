import React from 'react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"

export default function CourseInformationForm() {




  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])



  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        setCourseCategories(categories)
      }
      setLoading(false)
    }

    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category._id)

      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    
    // Get the category ID from the form or the course object
    const currentCategoryId = typeof currentValues.courseCategory === 'object' 
      ? currentValues.courseCategory._id 
      : currentValues.courseCategory;
      
    const originalCategoryId = typeof course.category === 'object'
      ? course.category._id
      : course.category;

    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      JSON.stringify(currentValues.courseTags) !== JSON.stringify(course.tag || []) ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentCategoryId !== originalCategoryId ||
      JSON.stringify(currentValues.courseRequirements) !== JSON.stringify(course.instructions || []) ||
      (currentValues.courseImage instanceof File || currentValues.courseImage !== course.thumbnail)
    ) {
      return true
    }
    return false
  }

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        
        // Always include courseId
        formData.append("courseId", course._id)
        
        // Add all fields to form data
        formData.append("courseName", data.courseTitle || course.courseName)
        formData.append("courseDescription", data.courseShortDesc || course.courseDescription)
        formData.append("price", data.coursePrice || course.price)
        formData.append("whatYouWillLearn", data.courseBenefits || course.whatYouWillLearn)
        
        // Handle category - get the ID if it's an object
        const currentCategory = data.courseCategory;
        const originalCategory = course.category;
        
        // Get the category ID from current and original values
        const currentCategoryId = currentCategory && typeof currentCategory === 'object' 
          ? currentCategory._id 
          : currentCategory;
          
        const originalCategoryId = originalCategory && typeof originalCategory === 'object'
          ? originalCategory._id
          : originalCategory;
        
        // Only append category if it's different from the original
        if (currentCategoryId && currentCategoryId !== originalCategoryId) {
          formData.append("category", currentCategoryId);
        }
        
        // Handle tags if they've changed
        const currentTags = data.courseTags || [];
        const originalTags = course.tag || [];
        
        if (JSON.stringify(currentTags) !== JSON.stringify(originalTags)) {
          formData.append("tag", JSON.stringify(currentTags));
        }
        // Handle course requirements/instructions if they've changed
        const currentRequirements = data.courseRequirements || [];
        const originalRequirements = course.instructions || [];
        
        if (JSON.stringify(currentRequirements) !== JSON.stringify(originalRequirements)) {
          formData.append("instructions", JSON.stringify(currentRequirements));
        }
        // Handle thumbnail image if it's been changed
        const currentImage = data.courseImage;
        const originalImage = course.thumbnail;
        
        // If currentImage is a File object or the URL has changed
        if (currentImage instanceof File || currentImage !== originalImage) {
          formData.append("thumbnailImage", currentImage);
        }
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-richblack-5 mb-6 border-b border-richblack-600 pb-4">
        Course Information
      </h2>

      {/* Course Title */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-500">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400"
        />
        {errors.courseTitle && (
          <span className="text-sm text-pink-500 mt-1">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-500">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 min-h-[120px] resize-vertical"
        />
        {errors.courseShortDesc && (
          <span className="text-sm text-pink-500 mt-1">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-500">*</sup>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400">
            <HiOutlineCurrencyRupee className="text-xl" />
          </div>
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="w-full px-4 py-3 pl-10 bg-richblack-700 border border-richblack-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400"
          />
        </div>
        {errors.coursePrice && (
          <span className="text-sm text-pink-500 mt-1">
            Valid course price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-500">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white"
        >
          <option value="" disabled className="bg-richblack-700">
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id} className="bg-richblack-700">
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="text-sm text-pink-500 mt-1">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-3">
        <label className="text-sm font-medium text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-500">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 min-h-[120px] resize-vertical"
        />
        {errors.courseBenefits && (
          <span className="text-sm text-pink-500 mt-1">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Next Button */}
      <div className="flex justify-end gap-x-4 pt-6 border-t border-richblack-700">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex items-center gap-x-2 px-6 py-2.5 bg-richblack-600 text-richblack-5 rounded-lg hover:bg-richblack-500 transition-colors font-medium disabled:opacity-50"
          >
            Continue Without Saving
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-x-2 px-6 py-2.5 bg-yellow-500 text-richblack-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium disabled:opacity-70"
        >
          {!editCourse ? "Next" : "Save Changes"}
          {!loading && <MdNavigateNext className="text-lg" />}
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-richblack-900"></div>
          )}
        </button>
      </div>
    </form>
  )
}