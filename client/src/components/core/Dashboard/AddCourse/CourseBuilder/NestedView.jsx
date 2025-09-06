import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdEdit, MdOutlineVideoLibrary, MdExpandMore, MdExpandLess } from "react-icons/md"
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
            const result = await deleteSection(
                {
                    sectionId,
                    courseId: course._id,
                },
                token
            )
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
            <div className="rounded-2xl bg-gray-900 p-6 shadow-xl border border-gray-700">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Course Content
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293a1 1 0 00-1.414 0l-1 1a1 1 0 000 1.414l8 8a1 1 0 001.414 0l1-1a1 1 0 000-1.414l-8-8z" clipRule="evenodd" />
                                </svg>
                                <span>{course?.courseContent?.length || 0} sections</span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                <span>{course?.courseContent?.reduce((total, section) => total + section.subSection.length, 0) || 0} lectures</span>
                            </div>
                        </div>
                    </div>
                </div>

                {course?.courseContent?.map((section) => (
                    <div key={section._id} className="mb-4 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-gray-600">
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-800 to-gray-700 cursor-pointer" onClick={() => toggleSection(section._id)}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg bg-gray-700 transition-all duration-300 ${expandedSections[section._id] ? 'bg-blue-500/20' : ''}`}>
                                    {expandedSections[section._id] ? (
                                        <MdExpandLess className="text-xl text-blue-400" />
                                    ) : (
                                        <MdExpandMore className="text-xl text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-100">{section.sectionName}</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {section.subSection.length} lecture{section.subSection.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleChangeEditSectionName(section._id, section.sectionName)
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edit Section"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
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
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Delete Section"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Subsections List */}
                        {expandedSections[section._id] && (
                            <div className="p-4 space-y-3 bg-gray-800">
                                {section.subSection.map((data) => (
                                    <div
                                        key={data?._id}
                                        className="flex items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition-all duration-300 cursor-pointer group border border-gray-600"
                                        onClick={() => setViewSubSection(data)}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="p-3 bg-gray-600 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 group-hover:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-100 truncate">{data.title}</h4>
                                                {data.timeDuration && (
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
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
                                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                                                title="Edit Lecture"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
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
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                                                title="Delete Lecture"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Lecture Button */}
                                <button
                                    onClick={() => setAddSubSection(section._id)}
                                    className="flex items-center gap-3 w-full p-4 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-xl transition-all duration-300 border border-dashed border-gray-600 hover:border-blue-400 group"
                                >
                                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Add New Lecture</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {course?.courseContent?.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl border border-dashed border-gray-700">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-300">No sections added yet</p>
                        <p className="text-sm mt-1">Start by adding your first section and lecture</p>
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
                <ConfirmationModal
                    modalData={confirmationModal}
                    isOpen={!!confirmationModal}
                />
            )}
        </>
    )
}