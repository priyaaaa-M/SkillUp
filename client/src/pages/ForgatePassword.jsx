import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");

    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch(); // ✅ Fixed

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 p-4">
            <div className="w-full max-w-md">
                {loading ? (
                    <div className="text-center text-richblue-5">Loading...</div>
                ) : (
                    <div className="bg-richblack-800 rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-richblue-5 mb-2">
                                {!emailSent ? "Reset Your Password" : "Check Your Email"}
                            </h1>
                            <p className="text-richblack-100">
                                {!emailSent
                                    ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
                                    : `We have sent the reset email to ${email}`}
                            </p>
                        </div>

                        <form onSubmit={handleOnSubmit} className="space-y-6">
                            {!emailSent && (
                                <div>
                                    <label className="block text-richblue-5 text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Your Email Address"
                                        className="w-full px-4 py-3 rounded-lg bg-richblack-700 border border-richblack-600 text-richblue-5 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-100 focus:border-transparent"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-yellow-100 text-richblack-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-100 focus:ring-offset-2 focus:ring-offset-richblack-800"
                            >
                                {!emailSent ? "Reset Password" : "Resend Email"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-yellow-5 hover:text-yellow-300 text-sm font-medium transition duration-200"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
