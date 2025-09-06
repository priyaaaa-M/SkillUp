const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from various possible locations
        const token = req.cookies.token ||
                     req.body.token ||
                     req.header("Authorization")?.replace("Bearer ", "");

        console.log('Auth middleware - Token:', token ? 'Token found' : 'No token found');

        // If token is missing, return error
        if (!token) {
            console.error('No token provided in request');
            return res.status(401).json({
                success: false,
                message: 'Token is required for authentication',
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded successfully:', decoded);
        } catch (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
                error: err.message
            });
        }

        // Fetch the complete user from database
        try {
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                console.error('User not found for token');
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Attach the complete user object to the request
            req.user = {
                id: user._id,
                email: user.email,
                accountType: user.accountType,
                firstName: user.firstName,
                lastName: user.lastName,
                // Add any other user fields you need
            };
            
            console.log('User authenticated:', { id: user._id, email: user.email });
            next();
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({
                success: false,
                message: 'Error authenticating user',
                error: error.message
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        console.log("Printing AccountType ", req.user.accountType);
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }
}