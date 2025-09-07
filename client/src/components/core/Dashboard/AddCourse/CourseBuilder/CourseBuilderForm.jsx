import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline, IoClose } from "react-icons/io5"
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice.js"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  // submit handler for section create/update
  const onSubmit = async (data) => {
    setLoading(true)
    let result

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }

    if (result) {
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="text-richblack-5 p-6 bg-richblack-800 min-h-screen">
      <h1 className="text-3xl font-semibold mb-2">Course Builder</h1>
      <p className="text-richblack-100 mb-8">
        Build your course structure by adding sections and lectures
      </p>

      {/* Section Create / Update Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8"
      >
        <div className="mb-4">
          <label
            htmlFor="sectionName"
            className="block text-sm font-medium mb-2"
          >
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            className="w-full bg-richblack-700 rounded-lg border border-richblack-500 p-3 text-richblack-5 placeholder-richblack-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            {...register("sectionName", { required: true })}
          />
          {errors.sectionName && (
            <span className="text-xs text-pink-200 mt-1">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={
              loading
                ? editSectionName
                  ? "Updating..."
                  : "Creating..."
                : editSectionName
                  ? "Edit Section Name"
                  : "Create Section"
            }
            customClasses={`${editSectionName
              ? "bg-yellow-50 text-richblack-900 hover:bg-yellow-200"
              : "bg-yellow-600 text-richblack-900 hover:bg-yellow-200"
              }`}
          >
            <IoAddCircleOutline size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-richblack-5 bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
            >
              <IoClose size={20} />
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Nested Section/Subsection View */}
      {course.courseContent.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-1">Course Sections</h2>
          <NestedView
            handleChangeEditSectionName={handleChangeEditSectionName}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center border-t border-richblack-700 pt-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-richblack-5 bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
        >
          <MdNavigateBefore size={20} />
          Back
        </button>
        <IconBtn
          disabled={loading}
          text="Next"
          onClick={goToNext}
          customClasses="bg-yellow-50 text-richblack-900 hover:bg-yellow-200"
        >
          <MdNavigateNext size={20} />
        </IconBtn>
      </div>
    </div>
  )
}
