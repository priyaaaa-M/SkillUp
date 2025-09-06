import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { selectCart, selectCartTotal } from '../../slices/cartSlice';
import { selectAuth } from '../../slices/authSlice';
import CheckoutForm from '../../components/core/Dashboard/Cart/CheckoutForm';
import { createPaymentIntent } from '../../services/apis/paymentAPI';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cart = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (!cart?.length) {
      navigate('/dashboard/cart');
      return;
    }

    const initializePayment = async () => {
      try {
        setLoading(true);
        const response = await createPaymentIntent({
          amount: Math.round(total * 100), // Convert to paise (smallest currency unit)
          currency: 'inr',
          metadata: {
            userId: user?._id,
            courseIds: JSON.stringify(cart.map(course => course._id)),
            courseNames: JSON.stringify(cart.map(course => course.courseName))
          },
          receipt_email: user?.email,
          description: `Purchase of ${cart.length} course(s) from SkillUp`
        });
        
        setClientSecret(response.clientSecret);
        setPaymentIntent(response);
      } catch (err) {
        console.error('Error initializing payment:', err);
        setError(err.message || 'Failed to initialize payment');
        toast.error('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      initializePayment();
    } else {
      navigate('/dashboard/cart');
    }
  }, [cart, total, navigate, dispatch]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#06b6d4',
      colorBackground: '#0f172a',
      colorText: '#f8fafc',
      colorDanger: '#ef4444',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-richblack-900">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-yellow-50 mx-auto mb-4" />
          <p className="text-richblack-100">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-richblack-900 p-4">
        <div className="max-w-md w-full bg-richblack-800 rounded-lg p-6 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-richblack-5 mb-2">Checkout Error</h2>
          <p className="text-richblack-200 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard/cart')}
              className="w-full bg-richblack-700 hover:bg-richblack-600 text-richblack-100 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-richblack-300 hover:text-yellow-50 mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Cart
        </button>

        <div className="bg-richblack-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-richblack-5 mb-6">Complete Your Purchase</h1>
            
            <div className="mb-8">
              <h2 className="text-lg font-medium text-richblack-100 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((course) => (
                  <div key={course._id} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-richblack-50 truncate">{course.courseName}</h3>
                      <p className="text-xs text-richblack-400">{course.instructor?.name || 'Instructor'}</p>
                    </div>
                    <div className="ml-4 text-sm font-medium text-yellow-50">
                      ₹{course.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
                <div className="border-t border-richblack-700 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-richblack-5">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-richblack-700 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FaLock className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-sm text-richblack-100">
                  Your payment is secure and encrypted. We use Stripe to process your payment information.
                </p>
              </div>
            </div>

            {clientSecret && paymentIntent && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm paymentIntent={paymentIntent} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
