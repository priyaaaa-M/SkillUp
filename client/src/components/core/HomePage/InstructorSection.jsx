import React from 'react'
import Instructor from "../../../../../assets/Images/Instructor.jpg"
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='py-16'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-12 items-center'>
          {/* Image Section */}
          <div className='lg:w-1/2 w-full'>
            <div className='relative'>
              <img
                src={Instructor}
                alt="Instructor teaching online"
                className='rounded-xl shadow-lg w-full max-w-[550px] mx-auto border-2 border-white'
              />
              <div className='absolute -bottom-4 -right-4 bg-caribbeangreen-500 text-white px-5 py-3 rounded-lg shadow-md hidden lg:block'>
                <div className='text-xl font-bold'>1200+</div>
                <div className='text-xs'>Active Instructors</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className='lg:w-1/2 w-full flex flex-col gap-6'>
            <h2 className='text-3xl md:text-4xl font-bold text-richblack-800'>
              Become an{' '}
              <HighlightText text={"Instructor"} />
            </h2>

            <p className='text-base md:text-lg text-richblack-600 leading-relaxed'>
              Instructors from around the world teach millions of students on SkillUp.
              We provide the tools and skills to teach what you love.
            </p>

            <div className='flex flex-col sm:flex-row gap-6 items-start mt-2'>
              <CTAButton active={true} linkto={"/signup"}>
                <div className='flex items-center gap-2'>
                  Start Teaching Today
                  <FaArrowRight className="text-xs" />
                </div>
              </CTAButton>

              <div className='flex items-center gap-3 text-richblack-500 text-sm'>
                <div className='flex items-center justify-center w-8 h-8 bg-caribbeangreen-100 rounded-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-caribbeangreen-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>No prior experience needed</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 mt-4'>
              <div className='flex items-center gap-2 text-sm text-richblack-600'>
                <div className='w-2 h-2 bg-caribbeangreen-500 rounded-full'></div>
                <span>Flexible hours</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-richblack-600'>
                <div className='w-2 h-2 bg-caribbeangreen-500 rounded-full'></div>
                <span>Global audience</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-richblack-600'>
                <div className='w-2 h-2 bg-caribbeangreen-500 rounded-full'></div>
                <span>Earn income</span>
              </div>
              <div className='flex items-center gap-2 text-sm text-richblack-600'>
                <div className='w-2 h-2 bg-caribbeangreen-500 rounded-full'></div>
                <span>Full support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection