const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

// Signup Controller for Registering Users
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body

    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      })
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Trim and validate password length
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      })
    }

    // Check if user already exists (case-insensitive email)
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1).lean()
    console.log('🔍 OTP Verification:', { 
      email,
      foundDocuments: response.length,
      submittedOTP: otp,
      storedOTP: response[0]?.otp,
    });

    if (response.length === 0) {
      // OTP not found for the email
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
      // Invalid OTP
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }

    // FIXED: Do NOT hash password here - let User model's pre-save middleware handle it
    // Pass plain trimmed password to User.create()

    // Handle approval based on accountType
    const approved = accountType !== "Instructor" ? true : false;

    // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber ? contactNumber.trim() : null,
    })

    // Create the user with plain password (model will hash it)
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      contactNumber: contactNumber ? contactNumber.trim() : undefined,
      password: trimmedPassword, // Plain password - model hashes
      accountType: accountType || 'Student',
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName.trim() + ' ' + lastName.trim())}`,
    })

    // Optionally, delete the used OTP after successful signup
    await OTP.deleteOne({ email });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("❌ Signup error:", error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // Trim password
    const trimmedPassword = password.trim();

    // Find user with provided email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).populate("additionalDetails")

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    // Compare Password (bcrypt.compare handles the hash)
    if (!(await bcrypt.compare(trimmedPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }

    // FIXED: Use accountType instead of role in JWT (consistent with model)
    const token = jwt.sign(
      { email: user.email, id: user._id, accountType: user.accountType }, // Use accountType
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    )

    // Save token to user document in database (but don't persist to DB, just for response)
    user.token = token
    user.password = undefined

    // Set cookie for token and return success response
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: `User Login Success`,
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      })
    }

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email: email.toLowerCase().trim() })
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(400).json({
        success: false,
        message: `User is Already Registered`,
      })
    }

    // FIXED: Generate unique OTP with limited attempts
    let generatedOtp, otpExists, attempts = 0;
    const maxAttempts = 5;
    do {
      generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OTP.findOne({ otp: generatedOtp });
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique OTP. Please try again.');
      }
    } while (otpExists);

    console.log("OTP", generatedOtp);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    const otpPayload = { email, otp: generatedOtp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    // FIXED: Do not return OTP in production response - only for development/debug
    const responseData = {
      success: true,
      message: `OTP Sent Successfully`,
    };
    if (process.env.NODE_ENV === 'development') {
      responseData.debugOtp = generatedOtp;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to send OTP. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    })
  }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user (assuming middleware sets req.user.id)
    const userDetails = await User.findById(req.user.id).populate("additionalDetails");

    // Get old password, new password from req.body (add confirmNewPassword if needed)
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      })
    }

    // Trim passwords
    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    // Validate new password length
    if (trimmedNewPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      })
    }

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      trimmedOldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // FIXED: Set plain new password and use .save() to trigger pre-save middleware for hashing
    userDetails.password = trimmedNewPassword;
    const updatedUserDetails = await userDetails.save();

    // Hide password
    updatedUserDetails.password = undefined;

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (emailError) {
      // Log email error but don't fail the password change (non-critical)
      console.error("Error occurred while sending email:", emailError)
      // If email is critical, uncomment below:
      // return res.status(500).json({ success: false, message: "Error occurred while sending email", error: emailError.message });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
