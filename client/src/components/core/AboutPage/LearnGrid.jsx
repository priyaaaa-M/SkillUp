import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import CTAButton from "../HomePage/Button"

const LearningGridArray = [
    {
        order: -1,
        heading: "SkillUp: Empowering Learners",
        highlightText: "Anywhere, Anytime",
        description: "SkillUp partners with top universities, industry leaders, and global organizations to make high-quality education accessible to everyone. Learn at your own pace, from anywhere in the world.",
        BtnText: "Explore Programs",
        BtnLink: "/programs",
    },
    {
        order: 1,
        heading: "Industry-Aligned Curriculum",
        description: "Our courses are designed with real-world applications in mind, ensuring that you gain the skills employers actually need today and in the future.",
    },
    {
        order: 2,
        heading: "Innovative Learning Methods",
        description: "From interactive lessons and live workshops to hands-on projects, SkillUp uses the latest tools and teaching methods to maximize your learning experience.",
    },
    {
        order: 3,
        heading: "Globally Recognized Certifications",
        description: "Earn certificates that are trusted by employers worldwide. Showcase your achievements and open doors to new opportunities in your career.",
    },
    {
        order: 4,
        heading: "Smart Assessments & Feedback",
        description: "Our auto-grading and instant feedback system helps you track progress in real time, identify areas for improvement, and stay on top of your learning goals.",
    },
    {
        order: 5,
        heading: "Career-Ready Skills",
        description: "Graduate with not just knowledge but practical skills. SkillUp equips you with the expertise, confidence, and portfolio to stand out in the job market.",
    },
]

const LearnGrid = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 ">
                {LearningGridArray.map((card, index) => (
                    <div
                        key={index}
                        className={`relative  p-8 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
                            ${index === 0 ?
                                "lg:col-span-2 bg-gradient-to-br from-richblue-900 to-richblack-800 hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.3)]" :
                                card.order % 2 === 1 ?
                                    "bg-richblack-700 hover:bg-richblack-600" :
                                    "bg-richblack-800 hover:bg-richblack-700"}
                            ${card.order === 3 && "lg:col-start-2"}
                            shadow-lg hover:shadow-xl hover:-translate-y-1
                            border border-transparent hover:border-richblack-400
                        `}
                    >
                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-richblack-900/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                        {card.order < 0 ? (
                            <div className="flex flex-col justify-between h-full relative z-10">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 mb-4 group-hover:text-white transition-colors duration-300">
                                        {card.heading} <HighlightText text={card.highlightText} />
                                    </h1>
                                    <p className="text-richblack-100 text-lg leading-relaxed mb-8 hover:text-richblack-50 transition-colors duration-300">
                                        {card.description}
                                    </p>
                                </div>
                                <CTAButton
                                    active={true}
                                    linkto={card.BtnLink}
                                    customClasses="w-fit hover:scale-[1.02] transition-transform duration-300"
                                >
                                    {card.BtnText}
                                </CTAButton>
                            </div>
                        ) : (
                            <div className="h-full relative z-10">
                                <h1 className="text-2xl font-bold text-richblack-5 mb-4 hover:text-yellow-400 transition-colors duration-300">
                                    {card.heading}
                                </h1>
                                <p className="text-richblack-100 leading-relaxed hover:text-richblack-50 transition-colors duration-300">
                                    {card.description}
                                </p>
                                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full hover:w-16 transition-all duration-500"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LearnGrid