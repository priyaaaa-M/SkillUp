import React from 'react'
import Logo1 from "../../../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../../../assets/images/TimelineImage.jpg"

const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description: "Fully committed to the success of your company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description: "Employees will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Description: "Adaptable to all your business needs",
    },
    {
        Logo: Logo4,
        heading: "Innovation",
        Description: "Constantly striving for better solutions",
    },
];

const TimelineSection = () => {
    return (
        <div className="bg-[#f7f7f7] py-16">
            <div className='max-w-6xl mx-auto px-4'>
                <h2 className="text-4xl font-bold text-center mb-16 text-richblack-800">
                    Our <span className="text-caribbeangreen-500">Journey</span>
                </h2>

                <div className='flex flex-col lg:flex-row gap-16 items-center'>
                    <div className='lg:w-[45%] flex flex-col gap-8'>
                        {timeline.map((element, index) => {
                            return (
                                <div
                                    className='flex gap-6 items-start group'
                                    key={index}
                                    data-aos="fade-right"
                                    data-aos-delay={index * 100}
                                >
                                    <div className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-caribbeangreen-50 transition-all duration-300'>
                                        <img src={element.Logo} alt={element.heading} className="w-8 h-8" />
                                    </div>

                                    <div>
                                        <h2 className='font-bold text-xl text-richblack-800 mb-1'>{element.heading}</h2>
                                        <p className='text-richblack-700'>{element.Description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className='relative lg:w-[55%]'>
                        <div className="relative overflow-hidden rounded-xl shadow-2xl">
                            <img
                                src={timelineImage}
                                alt="Our timeline"
                                className='w-full h-auto object-cover'
                            />
                        </div>

                        <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-caribbeangreen-700 flex flex-row text-white uppercase rounded-lg overflow-hidden shadow-xl'>
                            <div className='flex flex-row gap-4 items-center border-r border-caribbeangreen-300 px-6 py-4'>
                                <p className='text-3xl font-bold'>10+</p>
                                <p className='text-caribbeangreen-200 text-sm font-medium'>Years of Experience</p>
                            </div>

                            <div className='flex gap-4 items-center px-6 py-4'>
                                <p className='text-3xl font-bold'>250+</p>
                                <p className='text-caribbeangreen-200 text-sm font-medium'>Types of Courses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimelineSection
