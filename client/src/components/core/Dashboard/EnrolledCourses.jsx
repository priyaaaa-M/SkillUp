import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import {
    FiClock,
    FiBookOpen,
    FiAward,
    FiBarChart2,
    FiArrowRight,
    FiUser,
    FiTrendingUp
} from 'react-icons/fi';
import {
    GiGraduateCap,
    GiProgression
} from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@radix-ui/react-avatar';

const EnrolledCourses = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate()

    const getEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await getUserEnrolledCourses(token);
            if (response) {
                setEnrolledCourses(response);
            } else {
                setEnrolledCourses([]);
                console.error("No data received from the server");
            }
        } catch (error) {
            console.error("Failed to fetch enrolled courses", error);
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    // Filter courses based on active tab
    const filteredCourses = enrolledCourses?.filter(course => {
        if (activeTab === 'completed') return (course.progressPercentage || 0) >= 100;
        if (activeTab === 'progress') return (course.progressPercentage || 0) < 100 && (course.progressPercentage || 0) > 0;
        return true;
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 14
            }
        }
    };

    const progressBarVariants = {
        hidden: { width: 0 },
        visible: (progress) => ({
            width: `${progress}%`,
            transition: {
                duration: 1.5,
                ease: "easeOut",
                delay: 0.3
            }
        })
    };

    const statsVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.2
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    const iconVariants = {
        hidden: { rotate: -180, opacity: 0 },
        visible: {
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                delay: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-richblack-900 to-richblack-800 p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header with Avatar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-richblack-5 mb-2">My Learning Journey</h1>
                        <p className="text-richblack-300">
                            {enrolledCourses?.length
                                ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}`
                                : 'Your enrolled courses will appear here'
                            }
                        </p>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 bg-richblack-800 rounded-full pl-2 pr-4 py-2"
                    >
                        <Avatar className="w-10 h-10 rounded-full bg-yellow-100 text-richblack-900 flex items-center justify-center font-bold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </Avatar>
                        <span className="text-richblack-5 font-medium">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </motion.div>
                </motion.div>

                {/* Learning Statistics - Now at the Top */}
                {enrolledCourses?.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                    >
                        <motion.div
                            variants={statsVariants}
                            whileHover="hover"
                            className="bg-gradient-to-br from-blue-900/70 to-blue-800/50 rounded-2xl p-5 text-center backdrop-blur-sm border border-blue-700/30"
                        >
                            <motion.div variants={iconVariants} className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-blue-700/30">
                                    <FiBookOpen className="w-6 h-6 text-blue-300" />
                                </div>
                            </motion.div>
                            <div className="text-2xl font-bold text-richblack-5 mb-1">
                                {enrolledCourses.length}
                            </div>
                            <div className="text-richblack-300 text-sm">Total Courses</div>
                        </motion.div>

                        <motion.div
                            variants={statsVariants}
                            whileHover="hover"
                            className="bg-gradient-to-br from-green-900/70 to-green-800/50 rounded-2xl p-5 text-center backdrop-blur-sm border border-green-700/30"
                        >
                            <motion.div variants={iconVariants} className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-green-700/30">
                                    <GiGraduateCap className="w-6 h-6 text-green-300" />
                                </div>
                            </motion.div>
                            <div className="text-2xl font-bold text-richblack-5 mb-1">
                                {enrolledCourses.filter(course => (course.progressPercentage || 0) >= 100).length}
                            </div>
                            <div className="text-richblack-300 text-sm">Completed</div>
                        </motion.div>

                        <motion.div
                            variants={statsVariants}
                            whileHover="hover"
                            className="bg-gradient-to-br from-yellow-900/70 to-yellow-800/50 rounded-2xl p-5 text-center backdrop-blur-sm border border-yellow-700/30"
                        >
                            <motion.div variants={iconVariants} className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-yellow-700/30">
                                    <GiProgression className="w-6 h-6 text-yellow-300" />
                                </div>
                            </motion.div>
                            <div className="text-2xl font-bold text-richblack-5 mb-1">
                                {enrolledCourses.filter(course => (course.progressPercentage || 0) < 100 && (course.progressPercentage || 0) > 0).length}
                            </div>
                            <div className="text-richblack-300 text-sm">In Progress</div>
                        </motion.div>

                        <motion.div
                            variants={statsVariants}
                            whileHover="hover"
                            className="bg-gradient-to-br from-purple-900/70 to-purple-800/50 rounded-2xl p-5 text-center backdrop-blur-sm border border-purple-700/30"
                        >
                            <motion.div variants={iconVariants} className="flex justify-center mb-3">
                                <div className="p-3 rounded-full bg-purple-700/30">
                                    <FiTrendingUp className="w-6 h-6 text-purple-300" />
                                </div>
                            </motion.div>
                            <div className="text-2xl font-bold text-richblack-5 mb-1">
                                {Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / enrolledCourses.length)}%
                            </div>
                            <div className="text-richblack-300 text-sm">Avg Progress</div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Tabs for filtering */}
                {enrolledCourses?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex space-x-2 mb-6 bg-richblack-800 p-1 rounded-xl w-fit"
                    >
                        {[
                            { id: 'all', label: 'All Courses', icon: FiBookOpen },
                            { id: 'progress', label: 'In Progress', icon: FiBarChart2 },
                            { id: 'completed', label: 'Completed', icon: FiAward }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-richblack-700 text-richblack-5 shadow-md'
                                    : 'text-richblack-300 hover:text-richblack-5'
                                    }`}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"
                        ></motion.div>
                    </div>
                ) : !enrolledCourses?.length ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-richblack-800 rounded-2xl p-8 text-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut"
                            }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-richblack-700 mb-4"
                        >
                            <FiBookOpen className="w-8 h-8 text-richblack-400" />
                        </motion.div>
                        <h2 className="text-xl font-semibold text-richblack-5 mb-2">No courses yet</h2>
                        <p className="text-richblack-300 mb-6">You haven't enrolled in any courses yet.</p>
                        <motion.button
                            onClick={() => navigate('/dashboard/enrolled-courses')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-yellow-50 text-richblack-900 font-medium rounded-lg hover:bg-yellow-25 transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            Browse Courses <FiArrowRight />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {/* Header Row */}
                        <motion.div
                            variants={itemVariants}
                            className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-richblack-800 rounded-lg"
                        >
                            <div className="col-span-5 text-richblack-200 text-sm font-medium">Course</div>
                            <div className="col-span-2 text-richblack-200 text-sm font-medium flex items-center gap-2">
                                <FiClock size={16} /> Duration
                            </div>
                            <div className="col-span-3 text-richblack-200 text-sm font-medium flex items-center gap-2">
                                <FiBarChart2 size={16} /> Progress
                            </div>
                            <div className="col-span-2 text-richblack-200 text-sm font-medium flex items-center gap-2">
                                <FiAward size={16} /> Status
                            </div>
                        </motion.div>

                        {/* Course Cards */}
                        <AnimatePresence>
                            {filteredCourses?.map((course, index) => (
                                <motion.div
                                    key={course._id || index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                                    className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700 hover:border-richblack-600 relative group"
                                >
                                    {/* Glow effect on hover */}
                                    {/* Clickable overlay - now with higher z-index */}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Course clicked:', course);
                                            
                                            // Navigate to the first available section and subsection
                                            if (course?.courseContent?.length > 0) {
                                                const firstSection = course.courseContent[0];
                                                if (firstSection?.subSection?.length > 0) {
                                                    const firstSubSection = firstSection.subSection[0];
                                                    const url = `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`;
                                                    console.log('Navigating to:', url);
                                                    navigate(url);
                                                    return;
                                                }
                                            }
                                            // Fallback to course details if no content is available
                                            console.log('No valid course content found, navigating to course details');
                                            navigate(`/course/${course._id}`);
                                        }}
                                        className="absolute inset-0 z-10 cursor-pointer"
                                        aria-label={`View ${course.courseName} course`}
                                    ></div>
                                    {/* Hover effect layer */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 relative z-0">
                                        {/* Course Info */}
                                        <div className="md:col-span-5 flex gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="flex-shrink-0 relative"
                                            >
                                                <img
                                                    src={course.thumbnail || 'https://via.placeholder.com/120x70?text=Course+Image'}
                                                    alt={course.courseName}
                                                    className="w-20 h-12 md:w-28 md:h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/120x70?text=Course+Image';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/60 to-transparent rounded-lg"></div>
                                            </motion.div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-richblack-5 text-sm md:text-base line-clamp-2 mb-1">
                                                    {course.courseName}
                                                </h3>
                                                <p className="text-richblack-300 text-xs md:text-sm line-clamp-2">
                                                    {course.courseDescription}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Duration */}
                                        <div className="md:col-span-2 flex items-center">
                                            <div className="flex items-center gap-2 text-richblack-200 text-sm">
                                                <motion.div
                                                    animate={{ rotate: [0, 5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 4 }}
                                                >
                                                    <FiClock size={16} />
                                                </motion.div>
                                                <span>{course?.totalDuration || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="md:col-span-3 flex items-center">
                                            <div className="w-full">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-richblack-300">Progress</span>
                                                    <span className="text-xs font-medium text-yellow-50">
                                                        {course.progressPercentage || 0}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        custom={course.progressPercentage || 0}
                                                        variants={progressBarVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        className="h-2 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-500 relative"
                                                        style={{ maxWidth: '100%' }}
                                                    >
                                                        <motion.div
                                                            className="absolute top-0 left-0 w-full h-full bg-yellow-200 opacity-30"
                                                            animate={{ x: ["0%", "100%"] }}
                                                            transition={{
                                                                duration: 1.5,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="md:col-span-2 flex items-center">
                                            <motion.div
                                                animate={{
                                                    scale: (course.progressPercentage || 0) >= 100 ? [1, 1.1, 1] : 1,
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: (course.progressPercentage || 0) >= 100 ? Infinity : 0,
                                                    repeatDelay: 1
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${(course.progressPercentage || 0) >= 100
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-blue-500/20 text-blue-300'
                                                    }`}
                                            >
                                                {(course.progressPercentage || 0) >= 100 ? (
                                                    <>
                                                        <FiAward className="inline" /> Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiBarChart2 className="inline" /> In Progress
                                                    </>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Continue Button for Mobile */}
                                    <div className="md:hidden p-4 border-t border-richblack-700">
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('Mobile continue clicked for course:', course);
                                                
                                                // Navigate to the first available section and subsection
                                                if (course?.courseContent?.length > 0) {
                                                    const firstSection = course.courseContent[0];
                                                    if (firstSection?.subSection?.length > 0) {
                                                        const url = `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSection.subSection[0]._id}`;
                                                        console.log('Mobile navigating to:', url);
                                                        navigate(url);
                                                        return;
                                                    }
                                                }
                                                // Fallback to course details if no content is available
                                                navigate(`/course/${course._id}`);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-2 bg-yellow-50 text-richblack-900 font-medium rounded-lg text-sm hover:bg-yellow-25 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Continue Learning <FiArrowRight />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default EnrolledCourses;