import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"
import { markLectureAsComplete, getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures, setEntireCourseData } from "../../../slices/viewCourseSlice"
import { FaCheckCircle, FaRedo, FaArrowLeft, FaArrowRight } from "react-icons/fa"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    try {
      if (!courseSectionData || !courseSectionData.length || !sectionId || !subSectionId) {
        return false
      }

      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data?._id === sectionId
      )

      if (currentSectionIndx === -1 || !courseSectionData[currentSectionIndx]?.subSection) {
        return false
      }

      const currentSubSectionIndx = courseSectionData[currentSectionIndx]
        .subSection
        .findIndex((data) => data?._id === subSectionId)

      return currentSectionIndx === 0 && currentSubSectionIndx === 0
    } catch (error) {
      return false
    }
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    if (!courseId || !subSectionId) {
      toast.error('Missing required data to mark lecture as complete')
      return
    }
    
    try {
      setLoading(true)
      
      const res = await markLectureAsComplete(
        { 
          courseId, 
          subsectionId: subSectionId 
        },
        token
      )
      
      if (res && res.success) {
        dispatch(updateCompletedLectures(subSectionId))
        
        const result = await getFullDetailsOfCourse(courseId, token)
        
        if (result && result.data) {
          dispatch(setEntireCourseData(result.data.courseDetails))
          const completedVideos = result.data.completedVideos || []
          dispatch(setCompletedLectures(completedVideos))
        }
        
        toast.success("Lecture marked as completed!")
      } else {
        const errorMsg = res?.message || 'Unknown error occurred'
        toast.error(`Failed to mark as completed: ${errorMsg}`)
      }
    } catch (error) {
      toast.error(error.message || "Failed to update lecture status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 text-white max-w-4xl mx-auto p-4">
      {/* Video Player Container */}
      <div className="relative rounded-2xl overflow-hidden bg-richblack-900 aspect-video border-2 border-richblack-700 shadow-2xl">
        {!videoData ? (
          <img
            src={previewSource}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
            className="h-full"
          >
            <BigPlayButton position="center" className="big-play-button-hover" />
            
            {/* Video End Overlay */}
            {videoEnded && (
              <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/95 via-richblack-900/80 to-transparent flex flex-col items-center justify-center p-6 z-10 backdrop-blur-sm">
                <div className="bg-richblack-800/90 border border-richblack-600 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
                  {/* Completion Status */}
                  {!completedLectures.includes(subSectionId) ? (
                    <div className="space-y-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLectureCompletion();
                        }}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                          loading
                            ? 'bg-richblack-600 text-richblack-300 cursor-not-allowed'
                            : 'bg-yellow-500 text-richblack-900 hover:bg-yellow-400 hover:scale-105 shadow-lg'
                        }`}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-richblack-900"></div>
                        ) : (
                          <FaCheckCircle className="text-xl" />
                        )}
                        {loading ? "Marking..." : "Mark as Completed"}
                      </button>
                      {loading && (
                        <div className="w-full bg-richblack-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full animate-pulse transition-all duration-300"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 rounded-xl border border-green-500/30">
                      <FaCheckCircle className="text-green-400 text-xl" />
                      <span className="text-green-400 font-semibold">✓ Completed</span>
                    </div>
                  )}

                  {/* Rewatch Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playerRef?.current) {
                        playerRef.current.seek(0);
                        playerRef.current.play();
                        setVideoEnded(false);
                      }
                    }}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-richblack-700 hover:bg-richblack-600 text-richblack-100 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    <FaRedo />
                    Rewatch Video
                  </button>
                </div>

                {/* Navigation Controls */}
                <div className="flex gap-4 mt-6">
                  {!isFirstVideo() && (
                    <button
                      onClick={goToPrevVideo}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-richblack-700 text-richblack-5 rounded-xl hover:bg-richblack-600 transition-all duration-200 disabled:opacity-50"
                    >
                      <FaArrowLeft className="text-sm" />
                      Previous
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      onClick={goToNextVideo}
                      disabled={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-richblack-900 rounded-xl hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50"
                    >
                      Next
                      <FaArrowRight className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-richblack-800 rounded-2xl p-6 border border-richblack-700 shadow-lg">
        <h1 className="text-2xl font-bold text-richblack-5 mb-3">{videoData?.title}</h1>
        <p className="text-richblack-200 leading-relaxed text-lg">{videoData?.description}</p>
        
        {/* Progress Indicator */}
        {completedLectures.includes(subSectionId) && (
          <div className="flex items-center gap-2 mt-4 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
            <FaCheckCircle />
            <span className="font-medium">Lesson Completed</span>
          </div>
        )}
      </div>

   

      {/* Custom CSS for BigPlayButton */}
      <style jsx>{`
        .big-play-button-hover {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .big-play-button-hover:hover {
          transform: scale(1.1);
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

export default VideoDetails