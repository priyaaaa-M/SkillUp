const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
require("dotenv").config();

// Models
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");

// Utils
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// ===============================
// SIGNUP CONTROLLER
// ===============================
exports.signup = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;

		// Validation
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
				message: "All fields are required",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match",
			});
		}

		// User already exists?
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please login to continue.",
			});
		}

		// OTP check
		const recentOtp = await OTP.find({ email })
			.sort({ createdAt: -1 })
			.limit(1);

		if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired OTP",
			});
		}

		// Password hashing
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create Profile for User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: contactNumber || null,
		});

		// Account approval (only auto true for Students)
		let approved = accountType === "Instructor" ? false : true;

		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType,
			approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
		});

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("SIGNUP ERROR:", error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
			error: error.message,
		});
	}
};

// ===============================
// LOGIN CONTROLLER
// ===============================
exports.login = async (req, res) => {
    console.log('Login request received:', { email: req.body.email });
    
    try {
        // Validate input
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.trim().toLowerCase() })
            .populate("additionalDetails")
            .lean();
            
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', user.email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password", // Generic message for security
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: user.email, 
                id: user._id, 
                accountType: user.accountType 
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Prepare user data for response
        const userData = { ...user };
        delete userData.password;
        userData.token = token;

        // Set cookie options
        const cookieExpiry = 30 * 24 * 60 * 60 * 1000; // 30 days
        const isProduction = process.env.NODE_ENV === 'production';
        
        const cookieOptions = {
            expires: new Date(Date.now() + cookieExpiry),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/',
            domain: isProduction ? '.skillup-1-3m2l.onrender.com' : undefined
        };

        // Set cookie and send response
        res.cookie("token", token, cookieOptions);
        
        console.log('Login successful for user:', user.email);
        return res.status(200).json({
            success: true,
            token,
            user: userData,
            message: "Login successful",
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ===============================
// SEND OTP CONTROLLER
// ===============================
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user already exists
		const checkUserPresent = await User.findOne({ email });
		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: "User is already registered",
			});
		}

		// Generate unique OTP
		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		// Ensure OTP is unique
		while (await OTP.findOne({ otp })) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
		}

		const otpPayload = { email, otp };
		await OTP.create(otpPayload);

		return res.status(200).json({
			success: true,
			// message: "OTP sent successfully",
			// otp, 
		});
	} catch (error) {
		console.error("SEND OTP ERROR:", error);
		return res.status(500).json({
			success: false,
			message: "Could not send OTP",
			error: error.message,
		});
	}
};

// ===============================
// CHANGE PASSWORD CONTROLLER
// ===============================
exports.changePassword = async (req, res) => {
	try {
		const userDetails = await User.findById(req.user.id);

		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Match old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			return res.status(401).json({
				success: false,
				message: "The old password is incorrect",
			});
		}

		// New password confirmation
		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({
				success: false,
				//message: "New password and confirm password do not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send confirmation email
		try {
			await mailSender(
				userDetails.email,
				passwordUpdated(
					userDetails.email,
					`Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
				)
			);
		} catch (emailError) {
			console.error("Email sending failed:", emailError);
			// but don't block password update if mail fails
		}

		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		console.error("CHANGE PASSWORD ERROR:", error);
		return res.status(500).json({
			success: false,
			message: "Error updating password",
			error: error.message,
		});
	}
};
