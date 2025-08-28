import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import { FiArrowLeft } from "react-icons/fi";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  const submitPasswordForm = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      };

      await changePassword(token, payload);
      reset();
      toast.success("Password updated successfully!");

      setTimeout(() => {
        navigate("/dashboard/my-profile");
      }, 1500);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-richblack-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">

          <h1 className="text-3xl font-bold text-white">Update Password</h1>
        </div>

        <form onSubmit={handleSubmit(submitPasswordForm)} className="bg-richblack-800 rounded-2xl shadow-xl overflow-hidden border border-richblack-700">
          <div className="p-8 border-b border-richblack-700">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-yellow-500/10 mr-4">
                <AiOutlineLock className="text-yellow-50 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Password Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="oldPassword" className="text-sm font-medium text-richblack-5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    placeholder="Enter current password"
                    className={`w-full px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.oldPassword ? "border-red-500" : "border-richblack-600"
                      }`}
                    {...register("oldPassword", { required: "Current password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400 hover:text-richblack-100 transition-colors"
                  >
                    {showOldPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} />
                    ) : (
                      <AiOutlineEye fontSize={20} />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <span className="text-sm text-red-400 flex items-center mt-1">
                    {errors.oldPassword.message}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-richblack-5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    className={`w-full px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.newPassword ? "border-red-500" : "border-richblack-600"
                      }`}
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters"
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400 hover:text-richblack-100 transition-colors"
                  >
                    {showNewPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} />
                    ) : (
                      <AiOutlineEye fontSize={20} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="text-sm text-red-400 flex items-center mt-1">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-richblack-5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.confirmPassword ? "border-red-500" : "border-richblack-600"
                      }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your new password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400 hover:text-richblack-100 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} />
                    ) : (
                      <AiOutlineEye fontSize={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-sm text-red-400 flex items-center mt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center p-6 bg-richblack-700">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-profile")}
              className="px-6 py-2.5 border border-richblack-500 rounded-lg text-richblack-5 hover:bg-richblack-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2.5 bg-yellow-500 text-richblack-900 rounded-lg hover:bg-yellow-400 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-richblack-900 mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <AiOutlineLock className="mr-2" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}