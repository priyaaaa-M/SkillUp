import React, { useEffect, useState, memo } from "react"
import { BsChevronDown, BsStarFill, BsStarHalf, BsStar, BsCheckCircleFill } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"

import IconBtn from "../../Common/IconBtn"
import { getAvgRating } from "../../../services/operations/courseDetailsAPI"

const VideoDetailsSidebar = ({ setReviewModal }) => {
  console.log('VideoDetailsSidebar rendered with setReviewModal:', typeof setReviewModal);
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const [expandedSections, setExpandedSections] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
      
      // Expand the current section by default
      if (courseSectionData?.[currentSectionIndx]?._id) {
        setExpandedSections(prev => ({
          ...prev,
          [courseSectionData[currentSectionIndx]._id]: true
        }))
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
    
    if (activeStatus !== sectionId) {
      setActiveStatus(sectionId)
    }
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-900 overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-4 p-5 border-b border-richblack-700 bg-gradient-to-b from-richblack-800 to-richblack-900">
          <div className="flex w-full items-center justify-between">
            <div
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-700 p-1 text-richblack-5 transition-all duration-200 hover:bg-richblack-600 hover:scale-95 cursor-pointer"
              title="Back to courses"
            >
              <IoIosArrowBack size={22} />
            </div>
            <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (completedLectures.length === 0) {
                      return;
                    }
                    
                    try {
                      if (typeof setReviewModal === 'function') {
                        setReviewModal(true);
                      } else {
                        toast.error("Cannot open review form. Please refresh the page.");
                      }
                    } catch (error) {
                      console.error('Error opening review modal:', error);
                      toast.error("An error occurred. Please try again.");
                    }
                  }}
                  className={`flex items-center justify-center gap-x-2 rounded-md py-2 px-4 font-medium transition-all duration-300 ${
                    completedLectures.length === 0 
                      ? 'bg-richblack-700 text-richblack-400 cursor-not-allowed shadow-inner' 
                      : 'bg-yellow-50 text-richblack-900 hover:bg-yellow-100 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  disabled={completedLectures.length === 0}
                  aria-label={completedLectures.length === 0 ? "Complete at least one lecture to review" : "Add Review"}
                >
                  <span>Add Review</span>
                </button>
                
                {completedLectures.length === 0 && (
                  <div className="absolute left-0 right-0 mt-1 text-center">
                    <p className="text-xs text-richblack-400">Complete a lecture to review</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Course Info */}
          <div className="flex flex-col w-full gap-3">
            <p className="text-lg font-semibold text-richblack-5 line-clamp-2 transition-all duration-300 hover:text-yellow-50">
              {courseEntireData?.courseName}
            </p>
            
            <div className="flex items-center gap-2">
              <span className="text-yellow-50 font-bold text-lg">
                {getAvgRating(courseEntireData?.ratingAndReviews || []).toFixed(1)}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = getAvgRating(courseEntireData?.ratingAndReviews || []);
                  return (
                    <span key={star} className="transition-transform duration-200 hover:scale-110">
                      {rating >= star ? (
                        <BsStarFill className="text-yellow-400" />
                      ) : rating >= star - 0.5 ? (
                        <BsStarHalf className="text-yellow-400" />
                      ) : (
                        <BsStar className="text-richblack-400" />
                      )}
                    </span>
                  );
                })}
              </div>
              <span className="text-xs text-richblack-400">
                ({courseEntireData?.ratingAndReviews?.length || 0} reviews)
              </span>
            </div>
            
            <div className="w-full bg-richblack-700 rounded-full h-2.5 mt-1">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${(completedLectures?.length / totalNoOfLectures) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-sm font-medium text-richblack-400 flex justify-between">
              <span>Progress</span>
              <span className="text-yellow-200">{completedLectures?.length} / {totalNoOfLectures} lectures</span>
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="h-full overflow-y-auto custom-scrollbar py-2">
          <div className="px-3 pb-2 text-xs font-semibold text-richblack-400 uppercase tracking-wider">
            Course Content
          </div>
          
          {courseSectionData.map((course, index) => (
            <div
              className="mb-1 text-sm text-richblack-5 transition-all duration-300"
              key={course._id}
            >
              {/* Section Header */}
              <div 
                className={`flex flex-row justify-between items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  activeStatus === course._id 
                    ? "bg-richblack-700 shadow-md" 
                    : "bg-richblack-800 hover:bg-richblack-700"
                }`}
                onClick={() => toggleSection(course._id)}
              >
                <div className="w-[75%] font-medium truncate">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-richblack-700 px-2 py-1 rounded-md">
                    {course?.subSection.length} {course?.subSection.length === 1 ? 'lecture' : 'lectures'}
                  </span>
                  <span
                    className={`transition-all duration-500 ${
                      expandedSections[course._id] ? "rotate-0" : "rotate-180"
                    }`}
                  >
                    <BsChevronDown size={14} />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedSections[course._id] ? "max-h-96" : "max-h-0"
                }`}
              >
                {course.subSection.map((topic, i) => (
                  <div
                    className={`flex items-center gap-3 px-5 py-3 mx-2 my-1 rounded-lg transition-all duration-300 ${
                      videoBarActive === topic._id
                        ? "bg-yellow-400 shadow-md text-richblack-900 font-semibold transform -translate-y-0.5"
                        : "bg-richblack-800 hover:bg-richblack-700 hover:translate-x-1"
                    } ${completedLectures.includes(topic?._id) ? "border-l-4 border-green-400" : ""}`}
                    key={topic._id}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      )
                      setVideoBarActive(topic._id)
                    }}
                  >
                    {completedLectures.includes(topic?._id) ? (
                      <BsCheckCircleFill className="text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-richblack-400 flex-shrink-0"></div>
                    )}
                    <span className="truncate">{topic.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4a5568 #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
          border-radius: 20px;
        }
      `}</style>
    </>
  )
}

export default memo(VideoDetailsSidebar);