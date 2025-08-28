import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";

const Error = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-richblack-900 to-richblack-800 flex flex-col justify-center items-center p-4 text-richblack-5">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl"
            >
                {/* Animated Icon */}
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1]
                    }}
                    transition={{ duration: 1.5, repeatDelay: 1 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-50 rounded-full opacity-20 animate-ping"></div>
                        <FiAlertTriangle className="text-yellow-50 text-9xl relative z-10 mx-auto" />
                    </div>
                </motion.div>

                {/* Error Code */}
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-9xl font-bold mb-2 bg-gradient-to-r from-yellow-50 to-yellow-100 bg-clip-text text-transparent"
                >
                    404
                </motion.h1>

                {/* Error Message */}
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold mb-4"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-richblack-200 text-lg mb-8"
                >
                    Oops! The page you're looking for seems to have wandered off into the digital void.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-yellow-50 text-richblack-900 font-semibold px-6 py-3 rounded-lg transition-colors hover:bg-yellow-100"
                        >
                            <FiHome className="text-lg" />
                            Go Home
                        </motion.button>
                    </Link>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 border border-richblack-700 text-richblack-5 font-semibold px-6 py-3 rounded-lg transition-colors hover:bg-richblack-700"
                    >
                        <FiArrowLeft className="text-lg" />
                        Go Back
                    </motion.button>

                    <Link to="/contact">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 border border-richblack-700 text-richblack-5 font-semibold px-6 py-3 rounded-lg transition-colors hover:bg-richblack-700"
                        >
                            <FiSearch className="text-lg" />
                            Browse Courses
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-12 text-richblack-400 text-sm"
                >
                    <p>If you believe this is an error, please contact support.</p>
                </motion.div>
            </motion.div>

            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden z-[-1]">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 15, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 15 + i * 3,
                            repeat: Infinity,
                            delay: i * 2,
                        }}
                        className="absolute text-richblack-700 text-4xl opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {["</>", "{}", "++", "||", "==="][i]}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Error;