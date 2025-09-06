import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import DocumentTitle from '/src/components/common/DocumentTitle';
import { fetchUserCart, removeFromCart, selectCart, selectCartTotal, selectCartItemsCount, selectCartLoading, selectCartError } from '/src/slices/cartSlice';
import { BuyCourse } from '/src/services/operations/studentFeaturesAPI';
import ErrorBoundary from '/src/components/common/ErrorBoundary';
import RenderCartCourses from './RenderCartCourses';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux
  const { token } = useSelector(state => state.auth || {});
  const { user } = useSelector(state => state.profile || {});
  
  // Get cart data using selectors
  const cartItems = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const totalItems = useSelector(selectCartItemsCount);
  const loading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  
  // Log cart state for debugging
  useEffect(() => {
    console.log('Cart state update:', {
      hasToken: !!token,
      cartItemsCount: cartItems?.length || 0,
      cartItems: cartItems,
      total,
      totalItems,
      loading,
      cartError: cartError || 'No errors'
    });
  }, [cartItems, total, totalItems, loading, cartError, token]);
  
  // Log when cart items change
  useEffect(() => {
    console.log('Cart items changed:', {
      count: cartItems?.length || 0,
      items: cartItems
    });
  }, [cartItems]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load cart data when component mounts or token changes
  useEffect(() => {
    if (token) {
      dispatch(fetchUserCart());
    }
  }, [dispatch, token]);
  
  // Handle remove from cart
  const handleRemoveFromCart = async (courseId) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    
    try {
      await dispatch(removeFromCart(courseId)).unwrap();
      toast.success('Course removed from cart');
    } catch (error) {
      console.error('Failed to remove course:', error);
      toast.error(error.message || 'Failed to remove course');
    }
  };
  
  // Handle Razorpay payment
  const initiateRazorpayPayment = async (orderId, amount) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'SkillUp',
      description: 'Course Purchase',
      order_id: orderId,
      handler: async function (response) {
        try {
          // Verify payment on your server
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
              amount: amount,
            }),
          });

          const result = await verifyResponse.json();
          
          if (result.success) {
            toast.success('Payment successful! Enrolling you to the courses...');
            // Redirect to success page or dashboard
            navigate('/dashboard/enrolled-courses');
          } else {
            toast.error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Error verifying payment');
        }
      },
      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
        email: user?.email || '',
        contact: user?.additionalDetails?.contactNumber || '',
      },
      theme: {
        color: '#F59E0B',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!token) {
      navigate('/login', { state: { from: '/dashboard/cart' } });
      toast.error('Please login to proceed to checkout');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Use the existing BuyCourse function from studentFeaturesAPI
      await BuyCourse(
        token,
        cartItems,
        user,
        navigate,
        dispatch
      );
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to proceed to checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Show loading state
  if (loading && !cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-richblack-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-richblack-800 rounded-full mb-6">
            <FaSpinner className="animate-spin h-8 w-8 text-yellow-50" />
          </div>
          <h2 className="text-2xl font-bold text-richblack-5 mb-2">Loading Your Cart</h2>
          <p className="text-richblack-300 max-w-md mx-auto">
            Please wait while we load your shopping cart...
          </p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (cartError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-500/10 mb-6">
          <FaExclamationTriangle className="h-12 w-12 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-richblack-100 mb-2">Error Loading Cart</h3>
        <p className="text-richblack-300 max-w-md mx-auto mb-6">
          {cartError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-richblack-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Show empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-richblack-800 mb-6">
          <FaShoppingCart className="h-12 w-12 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-richblack-100 mb-2">Your cart is empty</h3>
        <p className="text-richblack-300 max-w-md mx-auto mb-6">
          Looks like you haven't added any courses to your cart yet.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-richblack-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          Browse Courses
        </Link>
      </div>
    );
  }
  
  // Show cart with items
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DocumentTitle 
        title={`Your Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'}) | SkillUp`}
        description={`Your shopping cart contains ${totalItems} items. Review and proceed to checkout.`}
      />
      
      <h1 className="text-3xl font-bold text-richblack-5 mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <RenderCartCourses 
            cart={cartItems}
            handleRemoveFromCart={handleRemoveFromCart}
            loading={loading}
            error={cartError}
          />
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-richblack-800 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-richblack-5 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-richblack-300">Subtotal ({totalItems} items)</span>
                <span className="text-richblack-5 font-medium">₹{total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-yellow-400">
                <span>Discount</span>
                <span>-₹0.00</span>
              </div>
              
              <div className="border-t border-richblack-700 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-richblack-5">Total</span>
                  <span className="text-yellow-400">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing || cartItems.length === 0}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-richblack-900 ${
                isProcessing || cartItems.length === 0
                  ? 'bg-yellow-300 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
              } transition-colors`}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
            
            <p className="mt-3 text-xs text-richblack-400 text-center">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with ErrorBoundary
export default function CartWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Cart />
    </ErrorBoundary>
  );
}
