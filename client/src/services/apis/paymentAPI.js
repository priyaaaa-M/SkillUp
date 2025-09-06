import { apiConnector } from '../apiConnector';
import { endpoints } from '../apis';

export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await apiConnector(
      'POST',
      endpoints.CREATE_PAYMENT_INTENT,
      paymentData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create payment intent');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('PAYMENT_API_ERROR:', error);
    throw new Error(error.response?.data?.message || 'Payment processing failed');
  }
};

export const verifyPayment = async (paymentId) => {
  try {
    const response = await apiConnector(
      'POST',
      endpoints.VERIFY_PAYMENT,
      { paymentId }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Payment verification failed');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('PAYMENT_VERIFICATION_ERROR:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};
