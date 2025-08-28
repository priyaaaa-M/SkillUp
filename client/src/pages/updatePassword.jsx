import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { resetPassword } from "../services/operations/authAPI"

function UpdatePassword() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { loading } = useSelector((state) => state.auth)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { password, confirmPassword } = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const token = location.pathname.split("/").at(-1)
        dispatch(resetPassword(password, confirmPassword, token, navigate))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-richblack-900 to-richblack-800 flex items-center justify-center p-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50 mb-4"></div>
                    <p className="text-richblack-5">Updating your password...</p>
                </div>
            ) : (
                <div className="w-full max-w-md bg-richblack-800 rounded-2xl shadow-xl overflow-hidden border border-richblack-700">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-yellow-50 mb-2">
                                Reset Your Password
                            </h1>
                            <p className="text-richblack-100">
                                Secure your account with a new password
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleOnSubmit} className="space-y-6">
                            {/* New Password */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-richblack-5 mb-2">
                                    New Password <span className="text-pink-200">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={handleOnChange}
                                        placeholder="Enter your new password"
                                        className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50 focus:border-transparent transition-all duration-200"
                                        minLength="8"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-3 text-richblack-300 hover:text-yellow-50 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible fontSize={20} />
                                        ) : (
                                            <AiOutlineEye fontSize={20} />
                                        )}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-richblack-200">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-richblack-5 mb-2">
                                    Confirm Password <span className="text-pink-200">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleOnChange}
                                        placeholder="Confirm your new password"
                                        className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50 focus:border-transparent transition-all duration-200"
                                        minLength="8"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-3 text-richblack-300 hover:text-yellow-50 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? (
                                            <AiOutlineEyeInvisible fontSize={20} />
                                        ) : (
                                            <AiOutlineEye fontSize={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-50 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Reset Password"}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="flex items-center justify-center gap-2 text-richblack-5 hover:text-yellow-50 transition-colors duration-200"
                            >
                                <BiArrowBack /> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdatePassword