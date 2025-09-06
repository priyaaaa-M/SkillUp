const User = require('../models/User');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

exports.addToCart = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID',
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Find user and update cart
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $addToSet: { cart: courseId } // Using addToSet to avoid duplicates
            },
            { new: true }
        ).populate('cart');

        res.status(200).json({
            success: true,
            message: 'Course added to cart',
            cart: user.cart,
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add course to cart',
            error: error.message,
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Find user and update cart
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $pull: { cart: courseId }
            },
            { new: true }
        ).populate('cart');

        res.status(200).json({
            success: true,
            message: 'Course removed from cart',
            cart: user.cart,
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove course from cart',
            error: error.message,
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).populate('cart');
        
        res.status(200).json({
            success: true,
            cart: user.cart || [],
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart',
            error: error.message,
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await User.findByIdAndUpdate(
            userId,
            { $set: { cart: [] } },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: [],
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
            error: error.message,
        });
    }
};
