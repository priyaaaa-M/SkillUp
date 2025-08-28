import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import { FiArrowLeft, FiSave, FiUser, FiCalendar, FiPhone, FiInfo } from "react-icons/fi";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-richblack-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/dashboard/my-profile")}
            className="flex items-center text-yellow-50 hover:text-yellow-200 transition-colors mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit(submitProfileForm)} className="bg-richblack-800 rounded-2xl shadow-2xl overflow-hidden border border-richblack-700">
          {/* Profile Information */}
          <div className="p-8 border-b border-richblack-700">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-yellow-500/10 mr-4">
                <FiUser className="text-yellow-50 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Profile Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-richblack-5">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.firstName ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("firstName", { required: true })}
                  defaultValue={user?.firstName}
                />
                {errors.firstName && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> Please enter your first name.
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-richblack-5">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.lastName ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("lastName", { required: true })}
                  defaultValue={user?.lastName}
                />
                {errors.lastName && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> Please enter your last name.
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-richblack-5 flex items-center">
                  <FiCalendar className="mr-2" /> Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white ${errors.dateOfBirth ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("dateOfBirth", {
                    required: {
                      value: true,
                      message: "Please enter your Date of Birth.",
                    },
                    max: {
                      value: new Date().toISOString().split("T")[0],
                      message: "Date of Birth cannot be in the future.",
                    },
                  })}
                  defaultValue={user?.additionalDetails?.dateOfBirth}
                />
                {errors.dateOfBirth && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> {errors.dateOfBirth.message}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="text-sm font-medium text-richblack-5">
                  Gender
                </label>
                <select
                  id="gender"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white ${errors.gender ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("gender", { required: true })}
                  defaultValue={user?.additionalDetails?.gender}
                >
                  <option value="" className="bg-richblack-700">Select Gender</option>
                  {genders.map((ele, i) => (
                    <option key={i} value={ele} className="bg-richblack-700">
                      {ele}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> Please select your gender.
                  </span>
                )}
              </div>

              {/* Contact Number */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contactNumber" className="text-sm font-medium text-richblack-5 flex items-center">
                  <FiPhone className="mr-2" /> Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  placeholder="Enter contact number"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.contactNumber ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("contactNumber", {
                    required: {
                      value: true,
                      message: "Please enter your Contact Number.",
                    },
                    maxLength: { value: 12, message: "Invalid Contact Number" },
                    minLength: { value: 10, message: "Invalid Contact Number" },
                  })}
                  defaultValue={user?.additionalDetails?.contactNumber}
                />
                {errors.contactNumber && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> {errors.contactNumber.message}
                  </span>
                )}
              </div>

              {/* About */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="about" className="text-sm font-medium text-richblack-5">
                  About
                </label>
                <textarea
                  id="about"
                  placeholder="Tell us about yourself..."
                  rows="3"
                  className={`px-4 py-3 bg-richblack-700 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition text-white placeholder-richblack-400 ${errors.about ? "border-red-500" : "border-richblack-600"
                    }`}
                  {...register("about", { required: true })}
                  defaultValue={user?.additionalDetails?.about}
                />
                {errors.about && (
                  <span className="text-sm text-yellow-500 flex items-center mt-1">
                    <FiInfo className="mr-1" /> Please tell us about yourself.
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
              <FiSave className="mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}