import { FaTrash, FaSpinner, FaRegSadTear, FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const defaultThumbnail = 'https://via.placeholder.com/300x200';

/**
 * RenderCartCourses - Displays the list of courses in the shopping cart
 * Handles loading, error, and empty states with appropriate UI feedback
 */
export default function RenderCartCourses({ 
  cart = [], 
  handleRemoveFromCart, 
  loading = false,
  error = null
}) {
  // Debug logging
  console.log('[RenderCartCourses] Cart data:', { 
    cart, 
    itemCount: Array.isArray(cart) ? cart.length : 0,
    loading, 
    error 
  });
  
  // Ensure cart is always an array and has valid items with default values
  const cartItems = (Array.isArray(cart) ? cart : [])
    .filter(item => item && (item._id || item.courseId))
    .map(item => ({...Object.freeze(item), // Freeze the original item to make it immutable
      courseName: item.courseName || 'Untitled Course',
      instructorName: item.instructor?.name || item.instructorName || 'Instructor',
      thumbnail: item.thumbnail || item.image || defaultThumbnail,
      price: typeof item.price === 'number' ? item.price : 0,
      originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : null
    }));
    
  // Debug log the processed cart items
  console.log('Processed cart items:', cartItems);
  
  // Handle loading state with skeleton loaders
  // Loading state with skeleton loaders
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="animate-pulse bg-richblack-700/50 rounded-lg p-4 border border-richblack-600"
            role="status"
            aria-label="Loading cart items..."
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-32 h-20 bg-richblack-600 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-richblack-600 rounded w-3/4"></div>
                <div className="h-3 bg-richblack-600 rounded w-1/2"></div>
                <div className="h-3 bg-richblack-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    const errorMessage = error.message || typeof error === 'string' ? error : 'Failed to load cart items';
    console.error('[RenderCartCourses] Error:', error);
    
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4">
          <FaExclamationTriangle className="h-10 w-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-richblack-100 mb-2">Unable to Load Cart</h3>
        <p className="text-richblack-300 mb-6 max-w-md mx-auto">
          {errorMessage}. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-colors"
          >
            Retry
          </button>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-richblack-700 text-richblack-100 rounded-md font-medium hover:bg-richblack-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Use the processed cart items directly
  const validCart = cartItems;

  // Empty cart state
  if (validCart.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-richblack-800 mb-6">
          <FaShoppingCart className="h-12 w-12 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-richblack-100 mb-2">Your cart is empty</h3>
        <p className="text-richblack-300 max-w-md mx-auto mb-6">
          Looks like you haven't added any courses to your cart yet. Start exploring our catalog to find amazing courses!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center px-6 py-3 bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Browse Courses
          </Link>
          <Link
            to="/dashboard/my-profile"
            className="inline-flex items-center justify-center px-6 py-3 bg-richblack-700 text-richblack-100 rounded-md font-medium hover:bg-richblack-600 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            View Profile
          </Link>
        </div>
      </div>
    );
  }
  
  // This check is now redundant since we filter above
  if (validCart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-richblack-800 mb-4">
          <FaExclamationTriangle className="h-10 w-10 text-yellow-400" />
        </div>
        <h3 className="text-xl font-medium text-richblack-50 mb-2">No valid courses in cart</h3>
        <p className="text-richblack-300 mb-6">The items in your cart could not be loaded. Please try adding them again.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center px-6 py-3 bg-yellow-50 text-richblack-900 font-medium rounded-md hover:bg-yellow-100 transition-colors"
        >
          <FaShoppingCart className="mr-2" />
          Browse Courses
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Cart Items List */}
      <div className="space-y-4">
        {validCart.map((course) => {
          // Use the already processed course properties
          const courseId = course._id || course.courseId;
          const courseName = course.courseName;
          const instructorName = course.instructorName;
          const thumbnail = course.thumbnail;
          const price = course.price;
          const originalPrice = typeof course.originalPrice === 'number' ? course.originalPrice : null;
          const hasDiscount = originalPrice && originalPrice > price;
          
          console.log('Rendering cart item:', { courseId, courseName, price });
          
          return (
            <div 
              key={courseId}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-richblack-800 rounded-lg border border-richblack-700 hover:border-richblack-600 transition-colors"
              data-testid="cart-item"
            >
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                {/* Course Thumbnail */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={thumbnail}
                    alt={`Thumbnail for ${courseName}`}
                    className="h-20 w-32 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultThumbnail;
                    }}
                    loading="lazy"
                  />
                  {course.rating && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-richblack-900 text-xs font-bold px-2 py-1 rounded-full">
                      {course.rating}★
                    </div>
                  )}
                </div>
                
                {/* Course Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-richblack-100 line-clamp-2">
                    {courseName}
                  </h3>
                  <p className="text-xs text-richblack-400 mt-1">
                    By {instructorName}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm font-bold text-yellow-400">
                      ₹{price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="ml-2 text-xs text-richblack-400 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                        {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Remove Button */}
                <div className="mt-2 sm:mt-0 flex justify-end">
                  <button
                    onClick={() => handleRemoveFromCart(courseId)}
                    className="group flex items-center gap-2 text-pink-200 hover:text-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!courseId || loading}
                    aria-label={`Remove ${courseName} from cart`}
                    title="Remove from cart"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Removing...</span>
                      </>
                    ) : (
                      <>
                        <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Remove</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Cart Summary */}
      <div className="mt-8 bg-richblack-800 rounded-lg border border-richblack-700 p-6">
        <h2 className="text-lg font-medium text-richblack-5 mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-richblack-300">Subtotal ({validCart.length} {validCart.length === 1 ? 'course' : 'courses'})</span>
            <span className="font-medium text-richblack-100">
              ₹{validCart.reduce((sum, item) => sum + (Number(item.price) || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="border-t border-richblack-700 pt-3 flex justify-between text-lg font-bold text-yellow-400">
            <span>Total</span>
            <span>₹{validCart.reduce((sum, item) => sum + (Number(item.price) || 0), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

RenderCartCourses.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      courseName: PropTypes.string,
      courseDescription: PropTypes.string,
      price: PropTypes.number,
      thumbnail: PropTypes.string,
      instructor: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string
      })
    })
  ),
  handleRemoveFromCart: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error)
};

RenderCartCourses.defaultProps = {
  cart: [],
  loading: false,
  error: null
};
