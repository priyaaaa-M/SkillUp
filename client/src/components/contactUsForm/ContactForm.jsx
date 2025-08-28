import React, { useEffect } from "react";
import ContactUsForm from "../common/ContactUsForm";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import contactUs from "../../../../assets/images/contactUs.png"

const ContactForm = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [controls, inView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div
            className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto"
            style={{
                backgroundImage: `url(${contactUs})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}
            ref={ref}
        >
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-richblack-900/90 to-richblack-800/80"></div>

            {/* Content */}
            <motion.div
                className="relative z-10 p-6 lg:p-10"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-richblack-5 mb-2 leading-tight">
                        Got an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">Idea?</span>
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        />
                        <motion.p
                            className="text-lg text-richblack-200 font-medium"
                            variants={itemVariants}
                        >
                            Let's create something amazing
                        </motion.p>
                    </div>
                </motion.div>

                <motion.p
                    className="text-richblack-200 mb-8 max-w-lg"
                    variants={itemVariants}
                >
                    Tell us about your project and we'll get back to you within 24 hours.
                </motion.p>

                <motion.div
                    className="bg-richblack-800/60 backdrop-blur-sm p-6 rounded-xl border border-richblack-600/50"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                >
                    <ContactUsForm />
                </motion.div>
            </motion.div>

            {/* Floating particles animation */}
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                    style={{
                        width: Math.random() * 10 + 5 + 'px',
                        height: Math.random() * 10 + 5 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                    }}
                    animate={{
                        y: [0, (Math.random() - 0.5) * 100],
                        x: [0, (Math.random() - 0.5) * 50],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

export default ContactForm;