import React from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCart, 
  selectCart, 
  selectCartLoading,
  selectCartItemsCount
} from '../../../../slices/cartSlice';
import Cart from './index';


const CartTestPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(state => state.cart.error);

  const handleAddTestCourse = async () => {
    try {
      const resultAction = await dispatch(addToCart(testCourse));
      if (addToCart.fulfilled.match(resultAction)) {
        toast.success('Test course added to cart!');
      } else if (addToCart.rejected.match(resultAction)) {
        toast.error(resultAction.error.message || 'Failed to add test course');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cart Test Page</h1>
      
      <div className="mb-6 p-4 bg-richblack-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={handleAddTestCourse}
            className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-colors"
          >
{loading ? 'Adding...' : 'Add Test Course'}
          </button>
          <div className="ml-auto">
            <span className="text-richblack-300">
              Items in cart: {useSelector(selectCartItemsCount)}
              {error && <span className="text-red-400 ml-2">Error: {error}</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Cart Component</h2>
        <Cart />
      </div>
    </div>
  );
};

export default CartTestPage;
