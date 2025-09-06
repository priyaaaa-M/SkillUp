import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { clearCart } from '../../../../slices/cartSlice';
import { enrollCourses } from '../../../../services/apis/courseAPI';
import { selectAuth } from '../../../../slices/authSlice';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#f8fafc',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#94a3b8',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useSelector(selectAuth);
  const cart = useSelector((state) => state.cart.cart);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Confirm the card payment
      if (!paymentIntent?.client_secret) {
        throw new Error('Payment initialization failed. Please try again.');
      }

      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
          receipt_email: user?.email,
          save_payment_method: false,
          setup_future_usage: 'off_session',
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (confirmedIntent.status === 'succeeded') {
        try {
          // Enroll the user in the courses
          const courseIds = cart.map(course => course._id);
          await enrollCourses(courseIds, token);
          
          // Clear the cart
          dispatch(clearCart());
          
          // Show success message
          toast.success('Payment successful! You are now enrolled in the courses.');
          
          // Redirect to enrolled courses
          navigate('/dashboard/enrolled-courses');
        } catch (enrollError) {
          console.error('Enrollment error:', enrollError);
          // Even if enrollment fails, we still want to show payment success
          // but we'll show a warning about the enrollment
          toast.success('Payment successful!', {
            description: 'There was an issue with course enrollment. Please contact support.',
            duration: 10000,
          });
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-richblack-100 mb-3">Payment Details</h3>
        <div className="bg-richblack-700 p-4 rounded-lg">
          <CardElement 
            options={{
              ...CARD_ELEMENT_OPTIONS,
              hidePostalCode: true,
            }}
          />
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !cart?.length || !paymentIntent}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-richblack-900 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
          (!stripe || processing || !cart?.length) ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-richblack-900" />
            Processing...
          </>
        ) : (
          <>
            <FaLock className="mr-2" />
            {cart?.length ? `Pay ₹${(paymentIntent?.amount / 100).toLocaleString('en-IN')}` : 'Cart is empty'}
          </>
        )}
      </button>

      <p className="text-xs text-richblack-400 text-center">
        Your payment is secure and encrypted. We use Stripe to process your payment information.
      </p>
    </form>
  );
};

export default CheckoutForm;
