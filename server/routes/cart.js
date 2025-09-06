const express = require('express');
const { auth, isStudent } = require('../middlewares/auth');
const { 
    addToCart, 
    removeFromCart, 
    getCart, 
    clearCart 
} = require('../controllers/Cart');

const router = express.Router();

// Add course to cart
router.post('/add-to-cart', auth, isStudent, addToCart);

// Remove course from cart
router.post('/remove-from-cart', auth, isStudent, removeFromCart);

// Get user's cart
router.get('/get-cart', auth, isStudent, getCart);

// Clear user's cart
router.delete('/clear-cart', auth, isStudent, clearCart);

module.exports = router;
