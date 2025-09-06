import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getInstructorDashboardData } from '../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaMoneyBillWave, FaBook, FaArrowRight, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Instructor = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [totalUniqueStudents, setTotalUniqueStudents] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getInstructorDashboardData(token);
                console.log('Instructor data response:', result);
                
                if (result && Array.isArray(result)) {
                    // If the API returns an array directly (legacy format)
                    console.log(`Found ${result.length} courses`);
                    setCourses(result);
                    
                    // Calculate unique students and total revenue
                    const allStudents = new Set();
                    let revenue = 0;
                    
                    result.forEach(course => {
                        revenue += course.totalAmountGenerated || 0;
                        if (course.studentsEnrolled && Array.isArray(course.studentsEnrolled)) {
                            course.studentsEnrolled.forEach(student => {
                                if (student && student._id) {
                                    allStudents.add(student._id.toString());
                                }
                            });
                        }
                    });
                    
                    setTotalUniqueStudents(allStudents.size);
                    setTotalRevenue(revenue);
                } else if (result?.courses && Array.isArray(result.courses)) {
                    // If the API returns an object with a courses array
                    console.log(`Found ${result.courses.length} courses`);
                    setCourses(result.courses);
                    setTotalUniqueStudents(result.totalUniqueStudents || 0);
                    
                    // Calculate total revenue
                    const revenue = result.courses.reduce((acc, curr) => acc + (curr.totalAmountGenerated || 0), 0);
                    setTotalRevenue(revenue);
                } else {
                    setCourses([]);
                    setTotalUniqueStudents(0);
                    setTotalRevenue(0);
                }
            } catch (error) {
                console.error('Error fetching instructor data:', error);
                setError('Failed to load instructor data');
                toast.error('Failed to load instructor dashboard');
            } finally {
                setLoading(false);
            }
        };
        
        fetchInstructorData();
    }, [token]);
    
    // Use the pre-calculated totals
    const totalStudents = totalUniqueStudents;
    const totalAmount = totalRevenue;

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
                duration: 0.5
            }
        }
    };

    const cardHoverVariants = {
        hover: {
            y: -5,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            transition: {
                duration: 0.3
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"
                ></motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6 min-h-screen bg-richblack-900 text-white"
        >
            {/* Header Section */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-richblack-5">Hello, {user?.firstName}!</h1>
                <p className="text-richblack-300 mt-2">Let's start something new and amazing today</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {courses.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Stats and Chart Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <motion.div variants={itemVariants} className="lg:col-span-2">
                                <InstructorChart courses={courses} />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="bg-richblack-800 rounded-2xl p-6 border border-richblack-700 shadow-lg">
                                <h2 className="text-xl font-bold text-richblack-5 mb-6 flex items-center gap-2">
                                    <FaBook className="text-yellow-50" /> Statistics
                                </h2>
                                
                                <div className="space-y-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="flex justify-between items-center p-4 bg-richblack-700 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <FaBook className="text-blue-300" />
                                            </div>
                                            <p className="text-richblack-5">Total Courses</p>
                                        </div>
                                        <p className="text-xl font-bold text-richblack-5">{courses.length}</p>
                                    </motion.div>
                                    
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="flex justify-between items-center p-4 bg-richblack-700 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg">
                                                <FaUsers className="text-green-300" />
                                            </div>
                                            <p className="text-richblack-5">Total Students</p>
                                        </div>
                                        <p className="text-xl font-bold text-richblack-5">{totalStudents} {totalStudents === 1 ? 'student' : 'students'}</p>
                                    </motion.div>
                                    
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="flex justify-between items-center p-4 bg-richblack-700 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                                <FaMoneyBillWave className="text-yellow-300" />
                                            </div>
                                            <p className="text-richblack-5">Total Income</p>
                                        </div>
                                        <p className="text-xl font-bold text-richblack-5">₹{totalAmount.toLocaleString('en-IN')}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Courses Section */}
                        <motion.div variants={itemVariants} className="bg-richblack-800 rounded-2xl p-6 border border-richblack-700 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <h2 className="text-xl font-bold text-richblack-5 flex items-center gap-2">
                                    <FaBook className="text-yellow-50" /> Your Courses
                                </h2>
                                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to="/dashboard/my-courses" 
                                        className="flex items-center gap-2 text-yellow-50 hover:text-yellow-100 transition-colors"
                                    >
                                        View all <FaArrowRight className="text-sm" />
                                    </Link>
                                </motion.div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {courses.slice(0, 3).map((course, index) => (
                                        <motion.div
                                            key={course._id}
                                            variants={cardHoverVariants}
                                            whileHover="hover"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-richblack-700 rounded-xl overflow-hidden border border-richblack-600"
                                        >
                                            <div className="h-40 overflow-hidden bg-richblack-600 flex items-center justify-center">
                                                {course.thumbnail ? (
                                                    <img 
                                                        src={course.thumbnail}
                                                        alt={course.courseName}
                                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="text-4xl text-richblack-400">📚</div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-richblack-5 font-semibold line-clamp-1 mb-2">
                                                    {course.courseName || 'Unnamed Course'}
                                                </h3>
                                                <div className="flex items-center text-richblack-300 text-sm">
                                                    <FaUsers className="mr-1 text-richblack-400" />
                                                    <span>{course.totalStudentsEnrolled || 0} students</span>
                                                    <span className="mx-2">•</span>
                                                    <span>₹ {course.price || 0}</span>
                                                </div>
                                                {course.status && (
                                                    <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                                                        course.status === 'Published' 
                                                            ? 'bg-green-500/20 text-green-300' 
                                                            : 'bg-yellow-500/20 text-yellow-300'
                                                    }`}>
                                                        {course.status}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center h-96 rounded-2xl bg-richblack-800 p-8 text-center border border-richblack-700 shadow-xl"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl mb-6"
                        >
                            📚
                        </motion.div>
                        <h2 className="text-2xl font-bold text-richblack-5 mb-2">No Courses Yet</h2>
                        <p className="text-richblack-300 mb-6 max-w-md">
                            You haven't created any courses yet. Start your journey by creating your first course and sharing your knowledge with the world.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link 
                                to="/dashboard/addCourse"
                                className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-100 transition-all shadow-lg"
                            >
                                <FaPlus /> Create Your First Course
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Instructor;