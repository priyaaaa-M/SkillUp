import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RxDropdownMenu } from "react-icons/rx"
import { MdEdit, MdOutlineVideoLibrary } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaPlus, FaPlayCircle } from "react-icons/fa"
import { BiTime } from "react-icons/bi"

import {
    deleteSection,
    deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    // States to manage modal mode [add, view, edit]
    const [addSubSection, setAddSubSection] = useState(null)
    const [viewSubSection, setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null)
    const [expandedSections, setExpandedSections] = useState({})
    const [confirmationModal, setConfirmationModal] = useState(null)

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }))
    }

    const handleDeleteSection = async (sectionId) => {
        try {
            const result = await deleteSection({
                sectionId,
                courseId: course._id,
                token,
            })
            if (result) {
                dispatch(setCourse(result))
            }
        } catch (error) {
            console.error("Error deleting section:", error)
        }
        setConfirmationModal(null)
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        try {
            const result = await deleteSubSection(
                {
                    subSectionId,
                    sectionId,
                },
                token
            )

            if (result) {
                const updatedCourseContent = course.courseContent.map((section) =>
                    section._id === sectionId ? result : section
                )
                const updatedCourse = { ...course, courseContent: updatedCourseContent }
                dispatch(setCourse(updatedCourse))
            }
        } catch (error) {
            console.error("Error deleting subsection:", error)
        }
        setConfirmationModal(null)
    }

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00"
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <>
            <div className="rounded-2xl bg-richblack-800 p-6 shadow-xl border border-richblack-700">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-richblack-5">Course Content</h2>
                    <p className="text-richblack-300 text-sm mt-1">
                        {course?.courseContent?.length || 0} sections • {course?.courseContent?.reduce((total, section) => total + section.subSection.length, 0) || 0} lectures
                    </p>
                </div>

                {course?.courseContent?.map((section) => (
                    <div key={section._id} className="mb-4 bg-richblack-700 rounded-xl overflow-hidden border border-richblack-600">
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-4 bg-richblack-600 cursor-pointer" onClick={() => toggleSection(section._id)}>
                            <div className="flex items-center gap-3">
                                <RxDropdownMenu className={`text-xl text-richblack-50 transition-transform ${expandedSections[section._id] ? 'rotate-90' : ''}`} />
                                <div>
                                    <h3 className="font-semibold text-richblack-50">{section.sectionName}</h3>
                                    <p className="text-richblack-300 text-sm">
                                        {section.subSection.length} lecture{section.subSection.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleChangeEditSectionName(section._id, section.sectionName)
                                    }}
                                    className="p-2 text-richblack-300 hover:text-yellow-50 hover:bg-richblack-500 rounded-lg transition-colors"
                                    title="Edit Section"
                                >
                                    <MdEdit className="text-lg" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setConfirmationModal({
                                            text1: "Delete Section?",
                                            text2: "All lectures in this section will be permanently deleted.",
                                            btn1Text: "Delete Section",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(null),
                                        })
                                    }}
                                    className="p-2 text-richblack-300 hover:text-pink-400 hover:bg-richblack-500 rounded-lg transition-colors"
                                    title="Delete Section"
                                >
                                    <RiDeleteBin6Line className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Subsections List */}
                        {expandedSections[section._id] && (
                            <div className="p-4 space-y-3">
                                {section.subSection.map((data) => (
                                    <div
                                        key={data?._id}
                                        className="flex items-center justify-between p-3 bg-richblack-600 rounded-lg hover:bg-richblack-500 transition-colors cursor-pointer group"
                                        onClick={() => setViewSubSection(data)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-2 bg-richblack-700 rounded-lg group-hover:bg-richblack-600 transition-colors">
                                                <MdOutlineVideoLibrary className="text-lg text-blue-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-richblack-50 truncate">{data.title}</h4>
                                                {data.timeDuration && (
                                                    <div className="flex items-center gap-1 text-richblack-300 text-sm">
                                                        <BiTime className="text-xs" />
                                                        <span>{formatDuration(data.timeDuration)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditSubSection({
                                                        ...data,
                                                        sectionId: section._id,
                                                    })
                                                }}
                                                className="p-2 text-richblack-300 hover:text-yellow-50 hover:bg-richblack-700 rounded-lg transition-colors"
                                                title="Edit Lecture"
                                            >
                                                <MdEdit className="text-lg" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setConfirmationModal({
                                                        text1: "Delete Lecture?",
                                                        text2: "This lecture will be permanently deleted from the course.",
                                                        btn1Text: "Delete Lecture",
                                                        btn2Text: "Cancel",
                                                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                        btn2Handler: () => setConfirmationModal(null),
                                                    })
                                                }}
                                                className="p-2 text-richblack-300 hover:text-pink-400 hover:bg-richblack-700 rounded-lg transition-colors"
                                                title="Delete Lecture"
                                            >
                                                <RiDeleteBin6Line className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Lecture Button */}
                                <button
                                    onClick={() => setAddSubSection(section._id)}
                                    className="flex items-center gap-2 w-full p-3 text-yellow-400 hover:text-yellow-300 hover:bg-richblack-600 rounded-lg transition-colors border border-dashed border-richblack-500 hover:border-yellow-400"
                                >
                                    <FaPlus className="text-sm" />
                                    <span>Add New Lecture</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {course?.courseContent?.length === 0 && (
                    <div className="text-center py-8 text-richblack-300">
                        <MdOutlineVideoLibrary className="text-4xl mx-auto mb-4 text-richblack-400" />
                        <p>No sections added yet</p>
                        <p className="text-sm">Start by adding your first section and lecture</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {addSubSection && (
                <SubSectionModal
                    modalData={{ sectionId: addSubSection }}
                    setModalData={setAddSubSection}
                    add={true}
                />
            )}
            {viewSubSection && (
                <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />
            )}
            {editSubSection && (
                <SubSectionModal
                    modalData={editSubSection}
                    setModalData={setEditSubSection}
                    edit={true}
                />
            )}

            {/* Confirmation Modal */}
            {confirmationModal && (
                <ConfirmationModal {...confirmationModal} />
            )}
        </>
    )
}