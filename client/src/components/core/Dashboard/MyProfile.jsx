import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'

import {
    FaStar,
    FaUser,
    FaEnvelope,
    FaUsers,
    FaPhone,
    FaCalendarAlt,
    FaInfoCircle,
    FaEdit
} from "react-icons/fa";

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    console.log("Profile component user:", user);

    const navigate = useNavigate();

    return (
        <div className='text-white w-full max-w-6xl mx-auto px-4'>
            {/* Page Title */}
            <div className='w-full max-w-6xl mx-auto'>
                <h1 className='text-2xl font-bold text-richblack-5 mb-6 flex items-center gap-2'>
                    <FaStar className='text-yellow-400 text-lg' />
                    My Profile
                </h1>
            </div>

            {/* Profile Header */}
            <div className='w-full max-w-2xl mx-auto bg-richblack-800 rounded-xl p-4 mb-6 border border-richblack-600'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                        {/* Profile Picture */}
                        <div className='relative w-[78px] h-[78px] rounded-full overflow-hidden'>
                            <img
                                src={user?.image ? user.image : "/default-avatar.png"}
                                alt={`profile-${user?.firstName}`}
                                className="w-full h-full object-cover select-none"
                                draggable={false}
                            />



                            <div className='absolute -bottom-1 -right-1 bg-yellow-400 text-richblack-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                                PRO
                            </div>
                        </div>
                        {/* Name + Email */}
                        <div className='w-full sm:w-auto'>
                            <p className='text-lg font-semibold text-richblack-5'>
                                {user?.firstName + " " + user?.lastName}
                            </p>
                            <p className='text-richblack-300 text-sm flex items-center gap-1 mt-0.5'>
                                <FaEnvelope className='text-richblack-400 text-xs' />
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className='w-full sm:w-auto'>
                        <IconBtn
                            text="Edit"
                            icon={<FaEdit className="text-xs mr-1" />}
                            onClick={() => navigate("/dashboard/settings")}
                            customClasses="w-full sm:w-auto bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                        />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className='w-full max-w-2xl mx-auto bg-richblack-800 rounded-xl p-4 mb-6 border border-richblack-600'>
                <div className='flex justify-between items-center mb-3 w-full'>
                    <h2 className='text-md font-semibold text-richblack-5 flex items-center gap-2'>
                        <FaInfoCircle className='text-blue-400 text-sm' />
                        About
                    </h2>
                    <IconBtn
                        text="Edit"
                        icon={<FaEdit className="text-xs mr-1" />}
                        onClick={() => navigate("/dashboard/settings")}
                        customClasses="bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-2.5 py-1 rounded text-xs font-medium"
                    />
                </div>
                <div className='w-full bg-richblack-700 p-3 rounded-lg'>
                    <p className='text-richblack-200 text-sm leading-relaxed'>
                        {user?.additionalDetails?.about || "Write something about yourself..."}
                    </p>
                </div>
            </div>

            {/* Personal Details */}
            <div className='w-full max-w-2xl mx-auto bg-richblack-800 rounded-xl p-4 border border-richblack-600'>
                <div className='flex justify-between items-center mb-4 w-full'>
                    <h2 className='text-md font-semibold text-richblack-5 flex items-center gap-2'>
                        <FaUser className='text-purple-400 text-sm' />
                        Personal Details
                    </h2>
                    <IconBtn
                        text="Edit"
                        icon={<FaEdit className="text-xs mr-1" />}
                        onClick={() => navigate("/dashboard/settings")}
                        customClasses="bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-2.5 py-1 rounded text-xs font-medium"
                    />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
                    <DetailCard
                        icon={<FaUser className='text-blue-400 text-xs' />}
                        label="First Name"
                        value={user?.firstName}
                    />
                    <DetailCard
                        icon={<FaEnvelope className='text-yellow-400 text-xs' />}
                        label="Email"
                        value={user?.email}
                    />
                    <DetailCard
                        icon={<FaUsers className='text-pink-400 text-xs' />}
                        label="Gender"
                        value={user?.additionalDetails?.gender || "Add Gender"}
                    />
                    <DetailCard
                        icon={<FaUser className='text-blue-400 text-xs' />}
                        label="Last Name"
                        value={user?.lastName}
                    />
                    <DetailCard
                        icon={<FaPhone className='text-caribbeangreen-400 text-xs' />}
                        label="Phone"
                        value={user?.additionalDetails?.contactNumber || "Add Phone"}
                    />
                    <DetailCard
                        icon={<FaCalendarAlt className='text-pink-400 text-xs' />}
                        label="DOB"
                        value={user?.additionalDetails?.dateOfBirth || "Add DOB"}
                    />
                </div>
            </div>
        </div>
    )
}

// Compact DetailCard Component with specific width
const DetailCard = ({ icon, label, value }) => (
    <div className='w-full bg-richblack-700 p-3 rounded-lg border border-richblack-600'>
        <div className='flex items-center gap-2 mb-1.5 w-full'>
            <div className='p-1 bg-richblack-800 rounded w-6 h-6 flex items-center justify-center'>
                {icon}
            </div>
            <p className='text-xs text-richblack-300 uppercase tracking-wide'>{label}</p>
        </div>
        <p className='text-richblack-5 font-medium text-sm w-full truncate' title={value}>
            {value}
        </p>
    </div>
)

export default MyProfile
