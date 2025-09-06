import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/free-mode'
import { FreeMode, Navigation, Pagination } from 'swiper/modules'

import Course_Card from './Course_Card'

const CourseSlider = ({ Course }) => {
  console.log('CourseSlider received courses:', Course);
  
  // Validate courses data
  const validCourses = (Array.isArray(Course) ? Course : []).filter(course => {
    const isValid = course && 
      typeof course === 'object' && 
      course._id && 
      course.courseName;
    
    if (!isValid) {
      console.warn('Invalid course data:', course);
    }
    
    return isValid;
  });
  
  console.log(`Found ${validCourses.length} valid courses out of ${Array.isArray(Course) ? Course.length : 0}`);
  
  if (validCourses.length === 0) {
    console.warn('No valid courses to display in CourseSlider');
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <p className="text-center text-richblack-300">No courses available to display</p>
        {Array.isArray(Course) && Course.length > 0 && (
          <p className="text-center text-richblack-500 text-sm mt-2">
            {Course.length} courses found but none are valid
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
      {validCourses.length > 0 ? (
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          freeMode={{
            enabled: true,
            sticky: false,
          }}
          modules={[FreeMode, Navigation, Pagination]}
          className="relative w-full"
        >
          {validCourses.map((course, index) => {
            console.log(`Rendering course ${index + 1}:`, course.courseName);
            return (
              <SwiperSlide key={course._id || index} className="h-auto pb-10">
                <Course_Card course={course} />
              </SwiperSlide>
            );
          })}
          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev text-richblack-900"></div>
          <div className="swiper-button-next text-richblack-900"></div>
        </Swiper>
      ) : (
        <p className="text-center text-richblack-300">
          {Course.length > 0 ? 'No valid courses to display' : 'No courses available'}
        </p>
      )}
    </div>
  )
}

export default CourseSlider
