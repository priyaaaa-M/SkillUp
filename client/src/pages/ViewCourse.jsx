import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import CourseReviewModal from "../components/core/ViewCourses/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourses/VideoDetailsSidebar"
import VideoDetails from "../components/core/ViewCourses/VideoDetails"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    resetCourseState
} from "../slices/viewCourseSlice"
import ErrorBoundary from "../components/common/ErrorBoundary"
import LoadingSpinner from "../components/common/LoadingSpinner"

export default function ViewCourse() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [reviewModal, setReviewModal] = useState(false)
    
    // Debug log for review modal state changes
    useEffect(() => {
      console.log('Review modal state changed:', reviewModal);
    }, [reviewModal])
    
    const handleReviewModal = (value) => {
      console.log('Setting review modal to:', value);
      setReviewModal(value);
    }
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId || !token) {
                setError("Missing course ID or authentication token");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await getFullDetailsOfCourse(courseId, token);
                
                if (!response || !response.success) {
                    throw new Error(response?.message || "Failed to fetch course details");
                }
                
                if (!response.data?.courseDetails) {
                    throw new Error("No course details found in response");
                }
                
                const { courseDetails, completedVideos = [] } = response.data;
                
                // Validate course content structure
                if (!Array.isArray(courseDetails.courseContent)) {
                    console.warn("Course content is not an array, setting to empty array");
                    courseDetails.courseContent = [];
                }
                
                // Dispatch data to Redux store
                dispatch(setCourseSectionData(courseDetails.courseContent));
                dispatch(setEntireCourseData(courseDetails));
                dispatch(setCompletedLectures(completedVideos || []));
                
                // Calculate total number of lectures
                const totalLectures = courseDetails.courseContent?.reduce(
                    (acc, section) => acc + (section?.subSection?.length || 0),
                    0
                ) || 0;
                
                dispatch(setTotalNoOfLectures(totalLectures));
                
            } catch (error) {
                console.error("Error in fetchCourseData:", error);
                setError(error.message || "Failed to load course data");
                toast.error(error.message || "Failed to load course data");
                
                // Redirect to dashboard if course not found or unauthorized
                if (error.message.includes("not found") || error.message.includes("unauthorized")) {
                    navigate("/dashboard/enrolled-courses");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourseData();
        
        // Cleanup function to reset state when component unmounts
        return () => {
            dispatch(resetCourseState());
        };
    }, [courseId, token, dispatch, navigate]);

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="text-center p-6 bg-red-50 rounded-lg max-w-md mx-auto">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Course</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={handleReviewModal} />
                <main className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <VideoDetails setReviewModal={setReviewModal} />
                    </div>
                </main>
            </div>
            {reviewModal && (
              <div 
                className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={() => handleReviewModal(false)}
              >
                <div 
                  className="w-full max-w-2xl bg-richblack-800 rounded-lg overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CourseReviewModal setReviewModal={handleReviewModal} />
                </div>
              </div>
            )}
        </ErrorBoundary>
    )
}
