import React from "react";
import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SidebarLink = ({ link, iconName, isCollapsed = false }) => {
    const Icon = iconName ? Icons[iconName] : null;
    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({ path: route, end: false }, location.pathname);
    };

    const isActive = matchRoute(link.path);

    return (
        <NavLink
            to={link.path}
            className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 group ${isActive
                ? "bg-yellow-800/20 text-yellow-50"
                : "bg-transparent text-richblack-300 hover:text-richblack-5 hover:bg-richblack-700/30"
                } ${isCollapsed ? "flex justify-center" : ""}`}
        >
            {/* Animated Left indicator */}
            {!isCollapsed && (
                <motion.span
                    className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-r-sm`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            )}

            {/* Hover background effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-600/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            />

            {/* Icon + Text */}
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-x-3"} relative z-10`}>
                {Icon && (
                    <motion.div
                        animate={{
                            scale: isActive ? 1.1 : 1,
                            color: isActive ? "#FFD700" : ""
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <Icon className={`text-lg ${isActive ? "text-yellow-50" : "group-hover:text-yellow-100"}`} />
                    </motion.div>
                )}

                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {link.name}
                    </motion.span>
                )}

                {/* Notification badge */}
                {!isCollapsed && link.notificationCount && (
                    <motion.span
                        className="ml-auto bg-yellow-400 text-richblack-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        {link.notificationCount}
                    </motion.span>
                )}
            </div>

            {/* Tooltip on hover (for collapsed sidebar) */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-richblack-800 text-richblack-5 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-50">
                    {link.name}
                </div>
            )}
        </NavLink>
    );
};

export default SidebarLink;