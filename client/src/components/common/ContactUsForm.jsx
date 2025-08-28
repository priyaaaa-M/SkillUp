import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { apiConnector } from '../../services/apiconnector'
import { contactusEndpoint } from '../../services/apis.js'
import CountryCode from "../../../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    const submitContactForm = async (data) => {
        console.log("Form Data:", data);
        try {
            setLoading(true);
            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
            const response = { status: "OK" }; // Mock response
            console.log("Response:", response);
            setLoading(false);
        } catch (error) {
            console.log("Error:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
                countryCode: ""
            });
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <div className="max-w-md mx-auto p-6 rounded-lg shadow-md text-white">
            <form onSubmit={handleSubmit(submitContactForm)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* First Name */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            {...register("firstname", {
                                required: "First name is required"
                            })}
                        />
                        {errors.firstname && (
                            <span className="text-red-500 text-xs mt-1">
                                {errors.firstname.message}
                            </span>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            {...register("lastname")}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Phone Number */}
                {/* Phone Number */}
                <div className="flex flex-col">
                    <div className="flex gap-2">
                        <select
                            className="w-1/4 px-2 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            defaultValue="+91"   // ✅ sets default code
                            {...register("countryCode", {
                                required: "Country code is required"
                            })}
                        >
                            <option value="">Code</option>
                            {CountryCode.map((element, index) => (
                                <option key={index} value={element.code}>
                                    {element.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            placeholder="Enter your number"   // ✅ placeholder text
                            className="flex-1 px-4 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            {...register("phoneNo", {
                                required: "Phone number is required",
                                minLength: {
                                    value: 8,
                                    message: "Minimum 8 digits required"
                                },
                                maxLength: {
                                    value: 12,
                                    message: "Maximum 12 digits allowed"
                                }
                            })}
                        />
                    </div>
                    {errors.countryCode && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.countryCode.message}
                        </span>
                    )}
                    {errors.phoneNo && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.phoneNo.message}
                        </span>
                    )}
                </div>


                {/* Message */}
                <div className="flex flex-col">
                    <textarea
                        placeholder="Your Message"
                        rows="4"
                        className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        {...register("message", {
                            required: "Message is required",
                            minLength: {
                                value: 10,
                                message: "Minimum 10 characters required"
                            }
                        })}
                    />
                    {errors.message && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.message.message}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors duration-200
                        ${loading
                            ? 'bg-yellow-400 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600'}
                    `}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default ContactUsForm;
