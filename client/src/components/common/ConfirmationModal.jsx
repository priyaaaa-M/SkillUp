import React, { useEffect } from "react";

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
            {/* Backdrop with blur effect */}
            <div className="fixed inset-0 bg-richblack-900 bg-opacity-80 backdrop-blur-sm transition-opacity duration-300"></div>

            {/* Modal content */}
            <div className="relative w-11/12 max-w-[400px] rounded-2xl border border-richblack-600 bg-richblack-800 p-8 shadow-2xl shadow-richblack-900/50 transform transition-transform duration-300 scale-100 z-10">

                {/* Warning Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-yellow-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-richblack-5 text-center mb-3">
                    {modalData?.text1}
                </h3>

                {/* Description */}
                <p className="text-richblack-200 text-sm text-center mb-6 leading-relaxed">
                    {modalData?.text2}
                </p>

                {/* Buttons Container */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    {/* Cancel Button */}
                    <button
                        className="w-full sm:w-auto cursor-pointer rounded-lg bg-richblack-600 py-2.5 px-5 font-medium text-richblack-50 hover:bg-richblack-500 transition-all duration-200 border border-richblack-500 hover:border-richblack-400"
                        onClick={modalData?.btn2Handler}
                    >
                        {modalData?.btn2Text || "Cancel"}
                    </button>

                    {/* Delete Button - Yellow */}
                    <button
                        className="w-full sm:w-auto cursor-pointer rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 py-2.5 px-5 font-medium text-richblack-900 hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-yellow-500/20"
                        onClick={modalData?.btn1Handler}
                    >
                        {modalData?.btn1Text || "Delete"}
                    </button>
                </div>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-richblack-400 hover:text-richblack-100 transition-colors duration-200 p-1 rounded-full hover:bg-richblack-700"
                    onClick={modalData?.btn2Handler}
                    aria-label="Close modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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