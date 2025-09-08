import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { BsStar, BsStarFill } from "react-icons/bs"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import { getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import { setEntireCourseData } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Debug logs
  useEffect(() => {
    console.log('CourseReviewModal - Component mounted');
    console.log('Course ID:', courseEntireData?._id);
    console.log('User:', user ? 'Logged in' : 'Not logged in');
    
    return () => {
      console.log('CourseReviewModal - Component unmounted');
    };
  }, [courseEntireData, user]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const handleCloseModal = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isSubmitting) {
      console.log('Prevent closing while submitting');
      return;
    }
    
    console.log('Closing review modal');
    if (typeof setReviewModal === 'function') {
      setReviewModal(false);
    }
  }, [setReviewModal, isSubmitting]);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    
    if (!courseEntireData?._id) {
      console.error("Course ID is missing");
      toast.error("Course information is not available. Please refresh the page and try again.");
      return;
    }

    if (!token) {
      console.error("Authentication token is missing");
      toast.error("You need to be logged in to submit a review.");
      return;
    }

    if (!data.courseRating || data.courseRating < 1) {
      console.error("Rating is required");
      toast.error("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Sending review request...");
      const reviewData = {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience || "",
      };
      
      console.log("Review payload:", reviewData);
      
      const response = await createRating(reviewData, token);
      console.log("Review API response:", response);
      
      if (response && response.success) {
        console.log("Review submitted successfully, refreshing course data...");
        const result = await getFullDetailsOfCourse(courseEntireData._id, token);
        
        if (result && result.data) {
          dispatch(setEntireCourseData(result.data.courseDetails));
          toast.success("Thank you for your review!");
          handleCloseModal();
        } else {
          throw new Error("Failed to update course data");
        }
      } else {
        const errorMsg = response?.message || "Failed to submit review";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in review submission:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!courseEntireData) {
    console.error('No course data available');
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={handleCloseModal}
    >
      <div 
        className="w-full max-w-md bg-richblack-800 rounded-xl overflow-hidden shadow-xl transform transition-all scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-richblack-900 border-b border-richblack-700">
          <h2 className="text-lg font-semibold text-richblack-5">Add Your Review</h2>
          <button 
            onClick={handleCloseModal}
            className="text-richblack-400 hover:text-richblack-100 transition-colors p-1 rounded-full hover:bg-richblack-700"
            disabled={isSubmitting}
          >
            <RxCross2 size={18} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {user && (
            <div className="flex items-center gap-3 pb-3">
              <div className="flex-shrink-0">
                <img
                  src={user?.image || '/default-avatar.png'}
                  alt={`${user?.firstName}'s profile`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-richblack-600"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div>
                <p className="font-medium text-richblack-5 text-sm">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-richblack-400">Posting publicly</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-richblack-5 text-center">
                How would you rate this course? <span className="text-pink-400">*</span>
              </label>
              <div className="flex justify-center">
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={32}
                  activeColor="#eab308"
                  color="#4b5563"
                  emptyIcon={<BsStar className="inline-block" />}
                  filledIcon={<BsStarFill className="inline-block" />}
                  classNames="flex gap-1"
                />
              </div>
              {errors.courseRating && (
                <p className="mt-1 text-xs text-pink-400 text-center">
                  Please select a rating
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="courseExperience"
                className="block text-sm font-medium text-richblack-5"
              >
                Share your experience (optional)
              </label>
              <textarea
                id="courseExperience"
                {...register("courseExperience")}
                placeholder="What did you like or dislike about this course?"
                className="w-full min-h-[100px] px-3 py-2.5 text-sm bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-transparent transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-medium text-richblack-200 bg-richblack-700 rounded-lg hover:bg-richblack-600 focus:outline-none focus:ring-1 focus:ring-richblack-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-medium text-richblack-900 bg-yellow-400 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-richblack-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
