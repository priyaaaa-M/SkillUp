import React, { useEffect } from "react";
import IconBtn from "./IconsButton";

const ConfirmationModal = ({ modalData, isOpen }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] !mt-0 grid place-items-center overflow-auto">
            {/* Backdrop with blur effect - only this part is blurred */}
            <div className="fixed inset-0 bg-richblack-900 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300"></div>

            {/* Modal content - this remains sharp and clear */}
            <div className="relative w-11/12 max-w-[400px] rounded-2xl border border-richblack-400 bg-gradient-to-b from-richblack-800 to-richblack-900 p-8 shadow-2xl shadow-richblack-500/10 transform transition-transform duration-300 scale-100 z-10">

                {/* Icon Header */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <p className="text-2xl font-bold text-richblack-5 text-center mb-4">
                    {modalData?.text1}
                </p>

                {/* Description */}
                <p className="mt-3 mb-7 leading-6 text-richblack-100 text-center opacity-90">
                    {modalData?.text2}
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-5">
                    <button
                        className="cursor-pointer rounded-xl bg-richblack-200 py-3 px-6 font-bold text-richblack-900 hover:bg-richblack-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                        onClick={modalData?.btn2Handler}
                    >
                        {modalData?.btn2Text}
                    </button>

                    <button
                        className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6 font-bold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                        onClick={modalData?.btn1Handler}
                    >
                        {modalData?.btn1Text}
                    </button>
                </div>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-richblack-300 hover:text-richblack-50 transition-colors duration-200"
                    onClick={modalData?.btn2Handler}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;