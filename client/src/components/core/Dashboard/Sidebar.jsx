import React, { useState } from "react";
import { sidebarLinks } from "../../../../../data/dashboard-links.js";
import { logout } from "../../../services/operations/authAPI.js";
import { useDispatch, useSelector } from "react-redux";
import { VscSettingsGear, VscSignOut, VscDashboard, VscChevronRight, VscChevronLeft } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import SidebarLink from "../Dashboard/SidebarLink"
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationModal from "../../common/ConfirmationModal";


const Sidebar = () => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (profileLoading || authLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[222px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <>
            <AnimatePresence>
                <motion.div
                    className={`flex h-full min-h-[calc(100vh-3.5rem)] flex-col border-r border-richblack-600 bg-gradient-to-b from-richblack-800 to-richblack-900 py-6 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between px-4 mb-6">
                        {!isCollapsed && (
                            <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                                    <VscDashboard className="text-xl text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-richblack-5 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                    Dashboard
                                </h2>
                            </motion.div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200 hover:scale-110 border border-richblack-600"
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? (
                                <VscChevronRight className="h-4 w-4 text-richblack-200" />
                            ) : (
                                <VscChevronLeft className="h-4 w-4 text-richblack-200" />
                            )}
                        </button>
                    </div>

                    {/* Sidebar links */}
                    <nav className="flex flex-col gap-1 px-2">
                        {sidebarLinks.map((link, index) => {
                            if (link.type && user?.accountType !== link.type) return null;
                            return (
                                <SidebarLink
                                    key={index}
                                    link={link}
                                    iconName={link.icon}
                                    isCollapsed={isCollapsed}
                                />
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="mx-auto mt-4 mb-4 h-px w-4/5 bg-gradient-to-r from-transparent via-richblack-600 to-transparent" />

                    {/* Settings & Logout */}
                    <div className="flex flex-col gap-1 px-2 mt-auto">
                        <SidebarLink
                            link={{ name: "Settings", path: "/dashboard/settings" }}
                            iconName={VscSettingsGear}
                            isCollapsed={isCollapsed}
                        />
                        <button
                            onClick={() =>
                                setConfirmationModal({
                                    text1: "Are you sure?",
                                    text2: "You will be logged out of your account.",
                                    btn1Text: "Logout",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => {
                                        dispatch(logout(navigate));
                                        setConfirmationModal(null);
                                    },
                                    btn2Handler: () => setConfirmationModal(null),
                                })
                            }
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-richblack-300 rounded-xl transition-all duration-200 hover:text-richblack-5 hover:bg-richblack-700 group border border-richblack-600 hover:border-richblack-500"
                        >
                            <div className="p-2 bg-richblack-700 rounded-lg group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-orange-500 transition-all duration-200">
                                <VscSignOut className="text-lg group-hover:text-white" />
                            </div>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    Logout
                                </motion.span>
                            )}
                        </button>
                    </div>


                </motion.div>
            </AnimatePresence>

            {/* Render Modal */}
            {confirmationModal && (
                <ConfirmationModal
                    modalData={confirmationModal}
                    isOpen={!!confirmationModal}
                />
            )}
        </>
    );
};

export default Sidebar;