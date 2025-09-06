import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { BsCurrencyRupee, BsInfoCircle } from 'react-icons/bs';
import { FaSpinner, FaLock } from 'react-icons/fa';
// Dynamically import Tooltip to handle cases where Chakra UI might not be available
let Tooltip = ({ children, label }) => (
  <div className="relative group inline-block">
    {children}
    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 w-48 p-2 text-xs text-center text-white bg-richblack-800 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2">
      {label}
    </div>
  </div>
);

// Try to use Chakra UI's Tooltip if available
try {
  const chakra = require('@chakra-ui/react');
  if (chakra && chakra.Tooltip) {
    Tooltip = chakra.Tooltip;
  }
} catch (e) {
  console.warn('Using fallback Tooltip component as @chakra-ui/react is not available');
}

// Format currency with validation
const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || !isFinite(num)) return '--';
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

export default function RenderTotalAmount({ 
  total = 0, 
  totalItems = 0, 
  handleCheckout, 
  loading = false,
  isProcessingPayment = false
}) {
  // Calculate amounts with proper validation and memoize
  const { displayTotal, displayGst, displayFinal, gstRate } = useMemo(() => {
    if (loading || isProcessingPayment) {
      return { 
        displayTotal: '--', 
        displayGst: '--', 
        displayFinal: '--',
        gstRate: '18%'
      };
    }
    
    const safeTotal = Math.max(0, Number(total) || 0);
    const gstRate = 0.18; // 18% GST
    const gst = safeTotal * gstRate;
    const final = safeTotal + gst;
    
    return {
      displayTotal: formatCurrency(safeTotal),
      displayGst: formatCurrency(gst),
      displayFinal: formatCurrency(final),
      gstRate: '18%'
    };
  }, [total, loading, isProcessingPayment]);
  
  const isCheckoutDisabled = totalItems === 0 || loading || isProcessingPayment;

  return (
    <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-600 shadow-lg">
      <h2 className="text-xl font-semibold text-richblack-5 mb-4 flex items-center gap-2">
        Order Summary
        <Tooltip 
          label="Prices include all applicable taxes" 
          placement="top"
          hasArrow
          bg="#1E1E2D"
          color="#F8FAFC"
          fontSize="sm"
          px={3}
          py={2}
          borderRadius="md"
        >
          <span>
            <BsInfoCircle className="text-richblack-400 hover:text-richblack-100 cursor-help" />
          </span>
        </Tooltip>
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-richblack-300">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            <span className="text-richblack-5 font-medium">
              <BsCurrencyRupee className="inline mr-0.5" aria-hidden="true" />
              {displayTotal}
            </span>
          </div>
          
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-1">
              <span className="text-richblack-300">GST ({gstRate})</span>
              <Tooltip 
                label="Goods and Services Tax" 
                placement="top"
                hasArrow
                bg="#1E1E2D"
                color="#F8FAFC"
                fontSize="sm"
                px={3}
                py={2}
                borderRadius="md"
              >
                <span>
                  <BsInfoCircle className="text-richblack-500 hover:text-richblack-100 text-xs cursor-help" />
                </span>
              </Tooltip>
            </div>
            <span className="text-richblack-5">
              <BsCurrencyRupee className="inline mr-0.5" aria-hidden="true" />
              {displayGst}
            </span>
          </div>
          
          <div className="border-t border-richblack-600 pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-richblack-5 font-medium text-base">Total Amount</span>
              <div className="text-right">
                <div className="text-yellow-50 font-bold text-lg">
                  <BsCurrencyRupee className="inline mr-0.5" aria-hidden="true" />
                  {displayFinal}
                </div>
                <div className="text-xs text-richblack-400">
                  incl. taxes & fees
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            onClick={handleCheckout}
            disabled={isCheckoutDisabled}
            className={`w-full py-3 px-4 rounded-lg font-medium text-richblack-900 ${
              !isCheckoutDisabled
                ? 'bg-yellow-50 hover:bg-yellow-100 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-richblack-600 cursor-not-allowed text-richblack-400'
            } transition-all duration-200 flex items-center justify-center gap-2`}
            aria-live="polite"
            aria-busy={loading || isProcessingPayment}
            aria-label={
              isProcessingPayment 
                ? 'Processing your payment...' 
                : loading 
                  ? 'Loading...' 
                  : totalItems > 0 
                    ? `Proceed to checkout - Total: ₹${displayFinal}`
                    : 'Add items to checkout'
            }
          >
            {isProcessingPayment ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing Payment...
              </>
            ) : loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Loading...
              </>
            ) : totalItems > 0 ? (
              <>
                <FaLock className="inline-block" />
                Proceed to Checkout
              </>
            ) : (
              'Add Items to Checkout'
            )}
          </button>
          
          {totalItems > 0 && (
            <p className="text-xs text-center text-richblack-400 mt-2">
              Secure payment processing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

RenderTotalAmount.propTypes = {
  /** The total amount before taxes */
  total: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  /** Number of items in the cart */
  totalItems: PropTypes.number.isRequired,
  /** Function to handle the checkout process */
  handleCheckout: PropTypes.func.isRequired,
  /** Whether the cart is in a loading state */
  loading: PropTypes.bool,
  /** Whether a payment is being processed */
  isProcessingPayment: PropTypes.bool
};

RenderTotalAmount.defaultProps = {
  loading: false,
  isProcessingPayment: false
};
