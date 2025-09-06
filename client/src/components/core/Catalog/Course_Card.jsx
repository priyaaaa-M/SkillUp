import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle } from "react-icons/fa";
import { FiBookOpen, FiClock, FiUsers } from "react-icons/fi";

const Course_Card = ({ course, Height = 'h-[300px]' }) => {
  // Debug log for course data
  useEffect(() => {
    if (!course) {
      console.error('Course_Card: No course data provided');
      return;
    }
    
    console.log('Course_Card received course:', {
      id: course._id,
      name: course.courseName,
      category: course.category,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      price: course.price,
      ratingCount: course.ratingAndReviews?.length || 0,
      studentsEnrolled: course.studentsEnrolled?.length || 0,
      status: course.status
    });
    
    // Log any missing required fields
    const requiredFields = ['_id', 'courseName', 'instructor', 'thumbnail'];
    const missingFields = requiredFields.filter(field => !course[field]);
    if (missingFields.length > 0) {
      console.warn(`Course ${course._id} is missing required fields:`, missingFields);
    }
  }, [course]);

  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Validate and process course data
  useEffect(() => {
    if (!course) return;
    
    try {
      const count = GetAvgRating(course.ratingAndReviews || []);
      setAvgReviewCount(count || 0);
    } catch (error) {
      console.error('Error calculating average rating:', error);
      setAvgReviewCount(0);
    }
    
    // Set a default thumbnail if none exists
    if (!course.thumbnail) {
      console.warn(`Course ${course._id} has no thumbnail`);
    }
  }, [course]);

  // Function to calculate average rating
  function GetAvgRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  }

  // Function to render star ratings
  const RatingStars = ({ Review_Count, Star_Size }) => {
    const stars = [];
    const fullStars = Math.floor(Review_Count);
    const hasHalfStar = Review_Count % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" size={Star_Size || 14} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" size={Star_Size || 14} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" size={Star_Size || 14} />);
      }
    }

    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Safely get instructor name
  const getInstructorName = () => {
    if (!course?.instructor) return 'Unknown Instructor';
    if (typeof course.instructor === 'string') return course.instructor;
    return `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim() || 'Unknown Instructor';
  };

  // Safely get instructor image
  const getInstructorImage = () => {
    if (!course?.instructor) return null;
    if (typeof course.instructor === 'string') return null;
    return course.instructor?.image;
  };

  // Format course duration if available
  const formatDuration = () => {
    if (!course?.duration) return null;
    const hours = Math.floor(course.duration / 60);
    const minutes = course.duration % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <motion.div
      className="w-full h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/course/${course._id}`}
        className="block w-full h-full bg-richblack-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-richblack-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail with overlay effect */}
        <div className="w-full aspect-video overflow-hidden bg-richblack-700 relative">
          <motion.img
            src={course?.thumbnail || 'https://via.placeholder.com/300x169?text=Course+Thumbnail'}
            alt={course?.courseName || 'Course Thumbnail'}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x169/101728/FFFFFF?text=No+Thumbnail';
              e.target.onerror = null;
            }}
          />

          {/* Overlay on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-richblack-900 bg-opacity-60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="px-4 py-2 bg-caribbeangreen-500 text-richblack-900 font-bold rounded-full"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                View Course
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-5 flex flex-col gap-3">
          {/* Course title */}
          <h3 className="text-lg font-bold text-richblack-5 line-clamp-2 leading-tight min-h-[3rem]">
            {course?.courseName || "Untitled Course"}
          </h3>

          {/* Instructor Info */}
          <div className="flex items-center gap-2">
            {getInstructorImage() ? (
              <img
                src={getInstructorImage()}
                alt={getInstructorName()}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getInstructorName())}&background=random&color=fff`;
                }}
              />
            ) : (
              <FaUserCircle className="w-6 h-6 text-richblack-400" />
            )}
            <p className="text-sm text-richblack-100 truncate">
              {getInstructorName()}
            </p>
          </div>

          {/* Course metadata */}
          <div className="flex items-center justify-between text-richblack-200 text-xs">
            {course?.duration && (
              <div className="flex items-center gap-1">
                <FiClock size={14} />
                <span>{formatDuration()}</span>
              </div>
            )}

            {course?.studentsEnrolled && (
              <div className="flex items-center gap-1">
                <FiUsers size={14} />
                <span>{course.studentsEnrolled.length}+ enrolled</span>
              </div>
            )}

            {course?.courseContent && (
              <div className="flex items-center gap-1">
                <FiBookOpen size={14} />
                <span>{course.courseContent.length} modules</span>
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-2 text-sm mt-1">
            <div className="flex items-center gap-1 bg-richblack-700 px-2 py-1 rounded-full">
              <span className="text-yellow-400 font-bold">{avgReviewCount.toFixed(1) || '0.0'}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={14} />
            </div>
            <span className="text-richblack-300">
              ({course?.ratingAndReviews?.length || 0} {course?.ratingAndReviews?.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Price and action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-richblack-700">
            <p className="text-xl font-bold text-caribbeangreen-300">
              {course?.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
            </p>

            <motion.div
              className="text-xs text-richblack-5 bg-richblack-700 px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              Enroll Now
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Course_Card;