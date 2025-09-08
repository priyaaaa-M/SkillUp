import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../../../assets/images/Know_your_progress.png"
import compare_with_others from "../../../../../assets/images/Compare_with_others.png"
import plan_your_lesson from "../../../../../assets/images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"

const LearningLanguageSection = () => {
    return (
        <div className='py-24 bg-gradient-to-b from-[#f9f9ff] to-white'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex flex-col items-center gap-8'>
                    {/* Heading Section */}
                    <div className='text-center max-w-3xl mx-auto'>
                        <h2 className='text-4xl md:text-5xl font-bold text-richblack-800 mb-4'>
                            Your Swiss Army Knife for <br />
                            <HighlightText text={"Learning Any Language"} />
                        </h2>
                        <p className='text-lg text-richblack-600'>
                            Revolutionize language learning with our all-in-one solution. Featuring 20+ languages, realistic voice recognition, progress tracking, personalized schedules, and more.
                        </p>
                    </div>

                    {/* Image Collage */}
                    <div className='relative w-full mt-12'>
                        <div className='flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0'>
                            <img
                                src={know_your_progress}
                                alt="Track your learning progress"
                                className='w-full md:w-[45%] max-w-[400px] object-contain z-10 md:-mr-12 hover:scale-105 transition-transform duration-300'
                                data-aos="fade-right"
                            />
                            <img
                                src={compare_with_others}
                                alt="Compare with other learners"
                                className='w-full md:w-[50%] max-w-[500px] object-contain z-20 shadow-xl rounded-lg hover:scale-105 transition-transform duration-300'
                                data-aos="fade-up"
                            />
                            <img
                                src={plan_your_lesson}
                                alt="Plan your lessons"
                                className='w-full md:w-[45%] max-w-[400px] object-contain z-10 md:-ml-12 hover:scale-105 transition-transform duration-300'
                                data-aos="fade-left"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className='hidden lg:block absolute -left-20 top-1/4 w-24 h-24 rounded-full bg-caribbeangreen-100 opacity-70 blur-xl'></div>
                        <div className='hidden lg:block absolute -right-20 bottom-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-70 blur-xl'></div>
                    </div>

                    {/* CTA Button */}
                    <div className='mt-16' data-aos="fade-up" data-aos-delay="300">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-2'>
                                Discover How It Works
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection
