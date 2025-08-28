import React from 'react';
import RenderSteps from './RenderStep ';
import { FiInfo, FiBook, FiVideo, FiDollarSign, FiImage, FiBell, FiFileText } from 'react-icons/fi';

// Custom Lightbulb SVG icon
const LightbulbIcon = () => (
    <svg
        className="text-xl"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
    </svg>
);

export default function Index() {
    return (
        <div className="bg-richblack-900 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row w-full items-start gap-6">
                    {/* Main Content */}
                    <div className="flex flex-1 flex-col bg-richblack-800 rounded-2xl p-6 shadow-lg">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-richblack-5 mb-2">
                                Create New Course
                            </h1>
                            <p className="text-richblack-300">
                                Fill out the form below to create your new course
                            </p>
                        </div>
                        <div className="flex-1">
                            <RenderSteps />
                        </div>
                    </div>

                    {/* Course Upload Tips */}
                    <div className="w-full lg:max-w-[400px] lg:sticky lg:top-10 rounded-2xl border border-richblack-600 bg-gradient-to-b from-richblack-800 to-richblack-900 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-richblack-600">
                            <div className="p-3 rounded-full bg-yellow-100 text-richblack-900">
                                <LightbulbIcon />
                            </div>
                            <p className="text-xl font-semibold text-richblack-5">Course Upload Tips</p>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiDollarSign className="text-yellow-100 text-xs" />
                                </div>
                                <span>Set the Course Price option or make it free.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiImage className="text-yellow-100 text-xs" />
                                </div>
                                <span>Standard size for the course thumbnail is 1024x576.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiVideo className="text-yellow-100 text-xs" />
                                </div>
                                <span>Video section controls the course overview video.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiBook className="text-yellow-100 text-xs" />
                                </div>
                                <span>Course Builder is where you create & organize a course.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiFileText className="text-yellow-100 text-xs" />
                                </div>
                                <span>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiInfo className="text-yellow-100 text-xs" />
                                </div>
                                <span>Information from the Additional Data section shows up on the course single page.</span>
                            </li>
                            <li className="flex items-start gap-3 text-richblack-5 text-sm">
                                <div className="p-1 rounded-full bg-richblack-700 mt-0.5">
                                    <FiBell className="text-yellow-100 text-xs" />
                                </div>
                                <span>Make Announcements to notify any important notes to all enrolled students at once.</span>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-richblack-600">
                            <div className="flex items-center gap-2 text-yellow-100 text-sm">
                                <FiInfo className="text-base" />
                                <span>Need help? Contact our support team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}