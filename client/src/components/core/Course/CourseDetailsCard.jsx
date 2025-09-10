import React, { useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsCheckCircle, BsFillPlayCircleFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants"

// Format duration in seconds to HH:MM:SS or MM:SS or SSs format
const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '0s';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}h`;
  } else if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}m`;
  } else {
    return `${secs}s`;
  }
};

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse, totalLectures, totalDuration, isEnrolled }) {
    const [isNavigating, setIsNavigating] = useState(false);
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
        _id: courseId,
        instructions,
        courseName
    } = course

    const handleShare = () => {
        copy(window.location.href)
        toast.success("Link copied to clipboard")
    }

    const handleAddToCart = async () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an Instructor. You can't buy a course.")
            return
        }
        
        if (!token) {
            setConfirmationModal({
                text1: "You are not logged in!",
                text2: "Please login to add to cart",
                btn1Text: "Login",
                btn2Text: "Cancel",
                btn1Handler: () => navigate("/login"),
                btn2Handler: () => setConfirmationModal(null),
            })
            return
        }
        
        try {
            // Create a clean course object with the required fields
            const courseToAdd = {
                _id: course._id,
                courseName: course.courseName,
                price: course.price,
                thumbnail: course.thumbnail,
                instructor: course.instructor,
                category: course.category,
                ratingAndReviews: course.ratingAndReviews || [],
                studentsEnroled: course.studentsEnroled || [],
                averageRating: course.ratingAndReviews?.length > 0 
                    ? course.ratingAndReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / course.ratingAndReviews.length
                    : 0
            }
            
            // Dispatch the addToCart action and wait for it to complete
            const resultAction = await dispatch(addToCart(courseToAdd))
            
            // Check if the action was fulfilled
            if (addToCart.fulfilled.match(resultAction)) {
                // Success toast will be shown by the cart slice
                return
            }
            
            // If we get here, there was an error, but it's already handled by the cart slice
        } catch (error) {
            console.error('Error adding to cart:', error)
            // Error toast is already shown by the cart slice
        }
    }

    // Check if user is enrolled either through the isEnrolled prop or by checking the studentsEnroled array
  const isUserEnrolled = isEnrolled || 
    (user && Array.isArray(course?.studentsEnroled) && 
      course.studentsEnroled.some(student => 
        typeof student === 'string' ? student === user?._id : student?._id === user?._id
      )
    )
    
  // Handle both purchase and continue learning actions
  const handleAction = async () => {
    if (isUserEnrolled) {
      // If already enrolled, navigate to the first lesson
      try {
        setIsNavigating(true);
        // Find the first section with subsections
        const firstSection = course.courseContent?.find(section => 
          section?.subSection?.length > 0
        );
        
        if (firstSection?.subSection?.[0]?._id) {
          navigate(`/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSection.subSection[0]._id}`);
        } else {
          toast.error('No lessons available in this course yet');
        }
      } catch (error) {
        console.error('Error navigating to course:', error);
        toast.error('Failed to load course content');
      } finally {
        setIsNavigating(false);
      }
    } else {
      // If not enrolled, proceed with purchase flow
      handleBuyCourse();
    }
  };

    return (
        <div className="flex flex-col gap-6 rounded-2xl bg-richblack-800 p-6 border border-richblack-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.05)] transition-all duration-300 sticky top-24 transform hover:-translate-y-1">
            {/* Course Image with Preview Overlay */}
            <div className="relative rounded-xl overflow-hidden">
                <img
                    src={ThumbnailImage}
                    alt={courseName}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-richblack-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-richblack-5">
                        <BsFillPlayCircleFill className="text-yellow-50" />
                        Preview
                    </div>
                </div>
            </div>

            {/* Pricing and Purchase Section */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold text-richblack-5">Rs. {CurrentPrice}</div>
                    {CurrentPrice && (
                        <div className="text-richblack-400 line-through text-sm">
                            Rs. {Math.round(CurrentPrice * 1.5)}
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col gap-3">
                    {isUserEnrolled ? (
                        <button
                            onClick={handleAction}
                            disabled={isNavigating}
                            className={`w-full py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 ${
                                isNavigating 
                                    ? 'bg-caribbeangreen-300 cursor-not-allowed' 
                                    : 'bg-caribbeangreen-400 hover:bg-caribbeangreen-300'
                            } text-richblack-900 flex items-center justify-center gap-2`}
                        >
                            {isNavigating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-richblack-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Continue Learning
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleBuyCourse}
                            className="w-full py-3 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
                        >
                            Buy Now
                        </button>
                    )}
                    
                    {!isUserEnrolled && (
                        <button 
                            onClick={handleAddToCart} 
                            className="w-full bg-richblack-700 text-richblack-5 py-3 rounded-lg font-bold hover:bg-richblack-600 transition-all duration-300 border border-richblack-600 hover:border-richblack-500 transform hover:scale-[1.02] active:scale-95"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
                
                <div className="text-center pt-2">
                    <p className="text-sm text-richblack-100">
                        30-Day Money-Back Guarantee
                    </p>
                </div>
            </div>

            {/* Course Includes Section */}
            <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                <h3 className="text-lg font-semibold text-richblack-5 mb-3">This course includes:</h3>
                <ul className="space-y-2 text-richblack-100">
                    <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {totalLectures || 0} {totalLectures === 1 ? 'lecture' : 'lectures'}
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(totalDuration || 0)} total length
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Access on mobile and desktop (2 Years)
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-yellow-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Full lifetime access
                    </li>
                </ul>
            </div>

            {/* Share Button */}
            <div className="text-center border-t border-richblack-700 pt-4">
                <p className="text-sm text-richblack-400 mb-2">Share with your friends</p>
                <button
                    className="flex items-center justify-center gap-2 text-yellow-50 hover:text-yellow-100 transition-all duration-300 mx-auto bg-richblack-700 hover:bg-richblack-600 px-4 py-2 rounded-lg"
                    onClick={handleShare}
                >
                    <FaShareSquare size={16} />
                    Share this course
                </button>
            </div>
        </div>
    )
}

export default CourseDetailsCard