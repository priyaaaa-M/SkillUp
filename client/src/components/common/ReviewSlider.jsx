import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

// Icons and animations
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log('Fetching reviews from:', ratingsEndpoints.GET_ALL_REVIEWS);
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.GET_ALL_REVIEWS
        );
        
        console.log('Reviews API Response:', response);
        
        if (response?.data?.success) {
          // The endpoint returns reviews in response.data.data
          const reviewsData = response.data.data || [];
          console.log('Fetched reviews:', reviewsData);
          
          if (!Array.isArray(reviewsData)) {
            console.warn('Unexpected reviews data format:', reviewsData);
            setError('Invalid reviews data format received from server');
            setReviews([]);
          } else {
            setReviews(reviewsData);
            if (reviewsData.length === 0) {
              console.log('No reviews found in the database');
            }
          }
        } else {
          throw new Error(response?.data?.message || "Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-yellow-50 p-4">
        <p>Error loading reviews: {error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-yellow-50 p-4">
        No reviews available yet. Be the first to review!
        <div className="mt-2 text-sm text-richblack-300">
          Complete a course to leave a review
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-richblack-5 mb-4"
        >
          What Students Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-richblack-300 max-w-2xl mx-auto"
        >
          Discover why thousands of students love our courses
        </motion.p>
      </div>

      {/* Reviews Slider */}
      <div className="relative">
        <Swiper
          modules={[FreeMode, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          freeMode={{
            enabled: true,
            sticky: false,
            momentumBounce: false,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.review-pagination',
            bulletClass: 'review-bullet',
            bulletActiveClass: 'review-bullet-active',
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            }
          }}
          breakpoints={{
            640: { 
              slidesPerView: 1,
              spaceBetween: 20 
            },
            768: { 
              slidesPerView: 2,
              spaceBetween: 25 
            },
            1024: { 
              slidesPerView: 3,
              spaceBetween: 30 
            },
            1280: { 
              slidesPerView: 4,
              spaceBetween: 30 
            },
          }}
          pagination={{
            clickable: true,
            el: '.review-pagination',
            bulletClass: 'review-bullet',
            bulletActiveClass: 'review-bullet-active',
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            }
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="pb-16"
          onSwiper={(swiper) => console.log('Swiper instance:', swiper)}
          onError={(error) => console.error('Swiper error:', error)}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-richblack-800 rounded-2xl p-6 h-full border border-richblack-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Quote Icon */}
                <div className="text-yellow-400 text-2xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  <FaQuoteLeft />
                </div>

                {/* Review Content */}
                <p className="text-richblack-100 leading-relaxed mb-6 line-clamp-5 group-hover:line-clamp-none transition-all">
                  {review.review}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={18}
                      edit={false}
                      activeColor="#FFD700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                  <span className="text-yellow-400 font-semibold text-sm">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-richblack-700">
                  <div className="relative">
                    <img
                      src={
                        review?.user?.image
                          ? review.user.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} ${review.user.lastName}`
                      }
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-richblack-600 group-hover:border-yellow-400 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-richblack-800"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-richblack-5 truncate">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <p className="text-richblack-400 text-sm truncate">
                      {review.course?.courseName}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="review-pagination flex justify-center gap-2 mt-8 absolute bottom-0 left-0 right-0" />
      </div>

      {/* CSS for custom pagination */}
      <style jsx>{`
        .review-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .review-bullet-active {
          width: 24px;
          background: #F59E0B;
          border-radius: 6px;
        }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ReviewSlider
