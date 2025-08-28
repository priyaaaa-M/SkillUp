import React from 'react'
import { motion } from 'framer-motion'

const stats = [
    { count: "5K+", label: "Active Students" },
    { count: "10+", label: "Expert Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards Won" }
]

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
}

const StackComponent = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-richblack-900 to-richblack-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
                    {stats.map((data, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-xl bg-richblack-700/50 backdrop-blur-sm border border-richblack-500 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10"
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                y: -5,
                                boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.1)"
                            }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                                {data.count}
                            </h1>
                            <h2 className="text-sm md:text-base font-medium text-richblack-100 uppercase tracking-wider">
                                {data.label}
                            </h2>
                            <div className="mt-4 h-1 w-12 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StackComponent