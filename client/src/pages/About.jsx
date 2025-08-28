import React from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImg1 from "../../../assets/images/aboutus1.png";
import BannerImg2 from "../../../assets/images/aboutus2.png";
import BannerImg3 from "../../../assets/images/aboutus3.png";
import Code from "../components/core/AboutPage/Code";
import FoundingStory from "../../../assets/images/FoundingStory.png"
import StackComponent from "../components/core/AboutPage/StackComponent"
import LearnGrid from "../components/core/AboutPage/LearnGrid"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/common/Footer"

const About = () => {
    return (
        <div className="mt-[100px] text-white">
            {/* Section 1 */}
            <section className="px-6 md:px-12">
                <header className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold md:text-5xl">
                        Driving Innovation in Online Education for a{" "}
                        <HighlightText text={"Brighter Future"} />
                    </h1>
                    <p className="mt-4 text-richblack-200 text-lg">
                        Studynotion is at the forefront of driving innovation in online
                        education. We're passionate about creating a brighter future by
                        offering cutting-edge courses, leveraging emerging technologies, and
                        nurturing a vibrant learning community.
                    </p>
                </header>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
                    <img
                        src={BannerImg1}
                        alt="Innovation"
                        className="w-full max-w-[300px] rounded-lg object-cover shadow-md"
                    />
                    <img
                        src={BannerImg2}
                        alt="Learning"
                        className="w-full max-w-[300px] rounded-lg object-cover shadow-md"
                    />
                    <img
                        src={BannerImg3}
                        alt="Community"
                        className="w-full max-w-[300px] rounded-lg object-cover shadow-md"
                    />
                </div>
            </section>

            {/* Section 2 */}
            <section className="mt-20 px-6 md:px-22">
                <div className="max-w-5xl mx-auto">
                    <Code />
                </div>
            </section>

            {/* Section 3 - Founding Story & Vision/Mission */}
            <section className="bg-richblack-900 overflow-hidden">
                {/* Founding Story Section */}
                <div className="relative max-w-7xl mx-auto px-6 py-20 md:px-12 lg:px-16">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <div
                            className="relative z-10 space-y-6"
                            data-aos="fade-right"  // Animation library would be needed
                        >
                            <h1 className="text-4xl font-bold">
                                Our <span className="text-blue-300">Founding</span> Story
                            </h1>

                            <div className="space-y-4 text-richblack-100 text-lg">
                                <p className="hover:bg-richblack-800 hover:scale-[1.02] transition-all duration-300 p-4 rounded-lg">
                                    Our e-learning platform was born out of a shared vision and passion for transforming
                                    education. It all began with a group of educators, technologists, and lifelong learners
                                    who recognized the need for accessible, flexible, and high-quality learning opportunities
                                    in a rapidly evolving digital world.
                                </p>

                                <p className="hover:bg-richblack-800 hover:scale-[1.02] transition-all duration-300 p-4 rounded-lg">
                                    As experienced educators ourselves, we witnessed firsthand the limitations and challenges
                                    of traditional education systems. We believed that education should not be confined to
                                    the walls of a classroom or restricted by geographical boundaries.
                                </p>
                            </div>


                        </div>

                        {/* Image */}
                        <div
                            className="relative group"
                            data-aos="fade-left"  // Animation library would be needed
                        >
                            <img
                                src={FoundingStory}
                                alt="Founding Story"
                                className="rounded-xl shadow-2xl w-full transform group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/70 to-transparent rounded-xl"></div>
                            <div className="absolute bottom-6 left-6 text-white group-hover:translate-y-2 transition duration-500">
                                <p className="text-sm font-light">Since 2025</p>
                                <p className="text-xl font-bold">Building the Future of Education</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Section */}
                <div className="bg-richblack-900 py-20 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16">
                            Our <span className="text-blue-300">Core</span> Values
                        </h2>

                        <div className="grid md:grid-cols-2 gap-10 bg-richblack-900">
                            {/* Vision Card */}
                            <div className="group relative bg-richblack-700 rounded-2xl p-8 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mb-6 bg-blue-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-blue-300">Our Vision</h3>
                                    <p className="text-richblack-100 group-hover:text-white transition-colors duration-300">
                                        With this vision in mind, we set out on a journey to create an e-learning platform that
                                        would revolutionize the way people learn. Our team of dedicated experts worked tirelessly
                                        to develop a robust and intuitive platform that combines cutting-edge technology with
                                        engaging content.
                                    </p>
                                </div>
                            </div>

                            {/* Mission Card */}
                            <div className="group relative bg-richblack-700 rounded-2xl p-8 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mb-6 bg-blue-500 rounded-lg flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-blue-300">Our Mission</h3>
                                    <p className="text-richblack-100 group-hover:text-white transition-colors duration-300">
                                        Our mission goes beyond just delivering courses online. We wanted to create a vibrant
                                        community of learners, where individuals can connect, collaborate, and learn from one
                                        another. We believe that knowledge thrives in an environment of sharing and dialogue.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* section 4 */}
            <StackComponent />

            {/* section 5 */}
            <section className="mx-auto flex flex-col items-center justify-between gap-4">
                <LearnGrid />
                <ContactFormSection />
            </section>

            <section>


                <div>
                    Review from other learners
                    {/* Review section */}

                </div>


            </section>

            <div>

                <Footer />
            </div>

        </div>
    );
};

export default About;
