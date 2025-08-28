import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../../../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';

const Home = () => {
    return (
        <div className="w-full overflow-hidden">
            {/* Hero Section */}
            <section className="relative mx-auto flex flex-col items-center w-11/12 max-w-maxContent text-white py-16">
                {/* Instructor CTA */}
                <Link
                    to="/signup"
                    className="group mt-8 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit shadow-lg hover:shadow-richblack-500/20"
                >
                    <div className="flex items-center gap-2 rounded-full px-8 py-2 transition-all duration-200 group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight className="text-sm" />
                    </div>
                </Link>

                {/* Main Heading */}
                <h1 className="text-center text-4xl md:text-5xl font-bold mt-8 leading-tight">
                    Empower Your Future with <br />
                    <HighlightText text={"Coding Skills"} />
                </h1>

                {/* Subheading */}
                <p className="mt-6 w-[90%] text-center text-lg text-richblack-300 max-w-[800px] leading-relaxed">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world,
                    and get access to a wealth of resources, including hands-on projects, quizzes,
                    and personalized feedback from instructors.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <CTAButton active={true} linkto="/signup">
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto="/login">
                        Book a Demo
                    </CTAButton>
                </div>

                {/* Banner Video */}
                <div className="mx-auto my-12 rounded-xl overflow-hidden shadow-2xl shadow-blue-300/30 w-full max-w-6xl">
                    <video
                        muted
                        loop
                        autoPlay
                        className="w-full h-auto"
                    >
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code Section 1 */}
                <div className="w-full my-16">
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock Your <HighlightText text={"coding potential"} /> with our online courses
                            </div>
                        }
                        subheading={"Our courses are designed and taught by industry experts..."}
                        ctabtn1={{
                            btnText: "try it yourself",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock={`<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1 class="main-title">Hello World</h1>\n</body>\n</html>`}
                    />
                </div>

                {/* Code Section 2 */}
                <div className="w-full my-16">
                    <CodeBlocks
                        position="lg:flex-row-reverse"
                        heading={
                            <div className="text-4xl font-bold leading-tight">
                                Start <HighlightText text="coding in minutes" /> <br />
                                with our interactive platform
                            </div>
                        }
                        subheading="Go from zero to hero with our structured learning paths and real-world projects that will build your portfolio as you learn."
                        ctabtn1={{
                            btnText: "continue lesson",
                            linkto: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }}
                        codeblock={`function greet() {\n  console.log("Hello, Developer!");\n}\n\ngreet();\n\n// Output: Hello, Developer!`}
                        codeColor="text-blue-300"
                    />
                </div>

                <ExploreMore />
            </section>

            {/* Features Section */}
            <section className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-80 flex items-center justify-center">
                    <div className="w-11/12 max-w-maxContent mx-auto flex flex-col items-center">
                        <div className="flex flex-col sm:flex-row gap-6 mt-16">
                            <CTAButton active={true} linkto="/signup">
                                <div className="flex items-center gap-3">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto="/signup">
                                Learn more
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="w-11/12 max-w-maxContent mx-auto py-16">
                    {/* Skills Section */}
                    <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Get the Skills you need for a <br />
                                <HighlightText text="Job that is in demand" />
                            </h2>
                        </div>
                        <div className="lg:w-1/2 flex flex-col gap-6">
                            <p className="text-lg text-richblack-600 leading-relaxed">
                                The modern StudyNotion dictates its own terms. Today, to be a competitive
                                specialist requires more than professional skills.
                            </p>
                            <CTAButton active={true} linkto="/signup">
                                Learn more
                            </CTAButton>
                        </div>
                    </div>

                    <TimelineSection />
                    <LearningLanguageSection />
                </div>
            </section>

            {/* Instructor & Testimonials Section */}

            <InstructorSection />

            <h2 className='justify-center text-white '> Reviews From Our Learner</h2>


            <Footer />
        </div>
    );
};

export default Home;