import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"

export default function SubSectionModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,
}) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        getValues,
    } = useForm()

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course)

    // prefill values if edit/view
    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title)
            setValue("lectureDesc", modalData.description)
            setValue("lectureVideo", modalData.videoUrl)
        }
    }, [modalData, view, edit, setValue])

    const isFormUpdated = () => {
        const currentValues = getValues()
        return (
            currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl
        )
    }

    // handle EDIT
    const handleEditSubsection = async () => {
        const currentValues = getValues()
        const formData = new FormData()
        formData.append("sectionId", modalData.sectionId)
        formData.append("subSectionId", modalData._id)

        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle)
        }
        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc)
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo)
        }

        setLoading(true)
        const result = await updateSubSection(formData, token)
        setLoading(false)

        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData.sectionId ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture updated successfully")
            setModalData(null)
        }
    }

    // handle CREATE
    const onSubmit = async (data) => {
        if (view) return

        if (edit) {
            if (!isFormUpdated()) {
                toast.error("No changes made to the form")
            } else {
                await handleEditSubsection()
            }
            return
        }

        const formData = new FormData()
        formData.append("sectionId", modalData.sectionId)
        formData.append("title", data.lectureTitle)
        formData.append("description", data.lectureDesc)
        formData.append("video", data.lectureVideo)

        setLoading(true)
        const result = await createSubSection(formData, token)
        setLoading(false)

        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData.sectionId ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture created successfully")
            setModalData(null)
        }
    }

    // handle DELETE
    const handleDeleteSubsection = async () => {
        if (!modalData?._id) {
            toast.error("No subsection found to delete")
            return
        }

        console.log("Deleting subsection:", modalData._id)

        const formData = new FormData()
        formData.append("subSectionId", modalData._id)
        formData.append("sectionId", modalData.sectionId)

        setLoading(true)
        const result = await deleteSubSection(formData, token)
        setLoading(false)

        if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData.sectionId ? result : section
            )
            dispatch(setCourse({ ...course, courseContent: updatedCourseContent }))
            toast.success("Lecture deleted successfully")
            setModalData(null)
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-richblack-900 bg-opacity-90 backdrop-blur-sm transition-all duration-300 p-4">
            <div className="w-full max-w-2xl rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-2xl shadow-richblack-900/50 animate-scaleIn">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-richblack-600 pb-4">
                    <p className="text-2xl font-bold text-richblack-5">
                        {view && "Viewing Lecture"}
                        {add && "Add New Lecture"}
                        {edit && "Edit Lecture"}
                    </p>
                    <button
                        onClick={() => (!loading ? setModalData(null) : {})}
                        className="text-richblack-300 hover:text-richblack-5 transition-all duration-200 rounded-full p-2 hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <RxCross2 className="text-2xl" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {/* Video Upload */}
                    <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
                        <h3 className="text-richblack-5 font-medium mb-3">Lecture Video</h3>
                        <Upload
                            name="lectureVideo"
                            label="Lecture Video"
                            register={register}
                            setValue={setValue}
                            errors={errors}
                            video={true}
                            viewData={view ? modalData.videoUrl : null}
                            editData={edit ? modalData.videoUrl : null}
                            disabled={view || loading}
                        />
                    </div>

                    {/* Title */}
                    <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
                        <label htmlFor="lectureTitle" className="block text-sm font-medium text-richblack-5 mb-3">
                            Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <input
                            disabled={view || loading}
                            id="lectureTitle"
                            placeholder="Enter Lecture Title"
                            className="w-full rounded-lg bg-richblack-600 border border-richblack-500 p-3.5 text-richblack-5 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 disabled:bg-richblack-500 disabled:text-richblack-400"
                            {...register("lectureTitle", { required: true })}
                        />
                        {errors.lectureTitle && (
                            <span className="text-xs text-pink-200 mt-2 block">Lecture title is required</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-richblack-700 p-4 rounded-lg border border-richblack-600">
                        <label htmlFor="lectureDesc" className="block text-sm font-medium text-richblack-5 mb-3">
                            Lecture Description {!view && <sup className="text-pink-200">*</sup>}
                        </label>
                        <textarea
                            disabled={view || loading}
                            id="lectureDesc"
                            rows={5}
                            placeholder="Enter Lecture Description"
                            className="w-full rounded-lg bg-richblack-600 border border-richblack-500 p-3.5 text-richblack-5 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 disabled:bg-richblack-500 disabled:text-richblack-400 resize-none"
                            {...register("lectureDesc", { required: true })}
                        />
                        {errors.lectureDesc && (
                            <span className="text-xs text-pink-200 mt-2 block">Lecture description is required</span>
                        )}
                    </div>

                    {/* Footer */}
                    {!view && (
                        <div className="flex justify-between items-center pt-2">
                            {/* DELETE button (always show in edit mode if _id exists) */}
                            {edit && modalData?._id && (
                                <button
                                    type="button"
                                    onClick={handleDeleteSubsection}
                                    className="flex items-center rounded-lg px-5 py-2.5 bg-pink-600 text-white hover:bg-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => odalData(null)}
                                    className="flex items-center rounded-lg px-5 py-2.5 text-richblack-5 bg-richblack-600 hover:bg-richblack-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                <IconBtn
                                    disabled={loading}
                                    type="submit"
                                    text={
                                        loading
                                            ? edit
                                                ? "Updating..."
                                                : "Creating..."
                                            : edit
                                                ? "Save Changes"
                                                : "Create Lecture"
                                    }
                                    customClasses="bg-yellow-50 text-richblack-900 hover:bg-yellow-100 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-medium px-5 py-2.5"
                                />
                            </div>
                        </div>
                    )}

                    {view && (
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setModalData(null)}
                                className="flex items-center rounded-lg px-5 py-2.5 text-richblack-5 bg-richblack-600 hover:bg-richblack-500 transition-all duration-200 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
