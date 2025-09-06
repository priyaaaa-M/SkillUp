import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { 
  addToCart as addToCartAPI, 
  removeFromCart as removeFromCartAPI, 
  fetchCart,
  clearCart as clearCartAPI
} from '../services/apis/cartAPI';

const initialState = {
  cart: [],
  totalItems: 0,
  total: 0,
  loading: false,
  error: null,
  items: [], // Add items array for better state management
};

// Helper function to safely access cart items from different response formats
const getCartItems = (cartData) => {
  try {
    if (!cartData) return [];
    
    // If it's already an array, return it directly
    if (Array.isArray(cartData)) {
      return cartData.filter(item => item && (item._id || item.courseId));
    }
    
    // If it's an object with a data property that has courses
    if (cartData.data && cartData.data.courses && Array.isArray(cartData.data.courses)) {
      return cartData.data.courses.filter(item => item && (item._id || item.courseId));
    }
    
    // If it's an object with a courses property
    if (cartData.courses && Array.isArray(cartData.courses)) {
      return cartData.courses.filter(item => item && (item._id || item.courseId));
    }
    
    // If it's an object with an items property
    if (cartData.items && Array.isArray(cartData.items)) {
      return cartData.items.filter(item => item && (item._id || item.courseId));
    }
    
    // If it's an object with a cart property
    if (cartData.cart && Array.isArray(cartData.cart)) {
      return cartData.cart.filter(item => item && (item._id || item.courseId));
    }
    
    // If it's an object that looks like a single course
    if (cartData._id || cartData.courseId) {
      return [cartData];
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing cart data:', error);
    return [];
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  if (!items || !Array.isArray(items)) return { totalItems: 0, total: 0 };
  
  const total = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price;
  }, 0);
  
  return {
    totalItems: items.length,
    total: total
  };
};

// Async thunks for cart operations
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (course, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('Please log in to add items to cart');
      }
      
      console.log('Adding course to cart:', course);
      const response = await addToCartAPI(course._id, auth.token);
      console.log('Add to cart API response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to add to cart');
      }
      
      // Return the entire response to handle different response structures
      return response.data || response.cart || [];
    } catch (error) {
      console.error('Error in addToCart thunk:', error);
      toast.error(error.message || 'Failed to add to cart');
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('Please log in to manage your cart');
      }
      
      console.log('Removing course from cart:', courseId);
      const response = await removeFromCartAPI(courseId, auth.token);
      console.log('Remove from cart API response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove from cart');
      }
      
      // Return the entire response to handle different response structures
      return response.data || response.cart || [];
    } catch (error) {
      console.error('Error in removeFromCart thunk:', error);
      toast.error(error.message || 'Failed to remove from cart');
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        console.log('No auth token found');
        return []; // Return empty array for unauthenticated users
      }
      
      console.log('Fetching cart with token:', auth.token);
      const response = await fetchCart(auth.token);
      console.log('Cart API response:', response);
      
      // Handle different response structures
      if (response.success === false) {
        throw new Error(response.message || 'Failed to fetch cart');
      }
      
      // Return the entire response and let the reducer handle the structure
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Synchronous reducers can go here
    resetCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.total = 0;
      state.loading = false;
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalItems = 0;
      state.total = 0;
      state.loading = false;
      state.error = null;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
      const { totalItems, total } = calculateCartTotals(action.payload);
      state.totalItems = totalItems;
      state.total = total;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        try {
          console.log('addToCart.fulfilled - action.payload:', action.payload);
          
          // Handle different response structures
          let cartItems = [];
          
          // Case 1: Response has a data property with courses
          if (action.payload?.data?.courses) {
            cartItems = Array.isArray(action.payload.data.courses) 
              ? action.payload.data.courses 
              : [];
          } 
          // Case 2: Response has a courses array directly
          else if (Array.isArray(action.payload?.courses)) {
            cartItems = action.payload.courses;
          }
          // Case 3: The payload is already an array of cart items
          else if (Array.isArray(action.payload)) {
            cartItems = action.payload;
          }
          // Case 4: Single item (should be an object with _id or courseId)
          else if (action.payload && (action.payload._id || action.payload.courseId)) {
            cartItems = [action.payload];
          }
          
          console.log('Processed cart items:', cartItems);
          
          // Update the state
          state.cart = cartItems;
          state.items = cartItems; // Keep both for backward compatibility
          
          // Calculate and update totals
          const { totalItems, total } = calculateCartTotals(cartItems);
          state.totalItems = totalItems;
          state.total = total;
          state.loading = false;
          state.error = null;
          
          console.log('Cart state after update:', state);
          toast.success('Course added to cart');
        } catch (error) {
          console.error('Error in addToCart.fulfilled:', error);
          state.loading = false;
          state.error = 'Failed to process cart update';
          toast.error('Failed to update cart');
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add course to cart';
        console.error('Add to cart error:', action.error);
        toast.error(state.error);
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        try {
          console.log('removeFromCart.fulfilled - action.payload:', action.payload);
          
          // Handle different response structures
          let cartItems = [];
          
          // Case 1: Response has a data property with courses
          if (action.payload?.data?.courses) {
            cartItems = Array.isArray(action.payload.data.courses) 
              ? action.payload.data.courses 
              : [];
          } 
          // Case 2: Response has a courses array directly
          else if (Array.isArray(action.payload?.courses)) {
            cartItems = action.payload.courses;
          }
          // Case 3: The payload is already an array of cart items
          else if (Array.isArray(action.payload)) {
            cartItems = action.payload;
          }
          
          console.log('Updated cart items after removal:', cartItems);
          
          // Update the state
          state.cart = cartItems;
          state.items = cartItems; // Keep both for backward compatibility
          
          // Calculate and update totals
          const { totalItems, total } = calculateCartTotals(cartItems);
          state.totalItems = totalItems;
          state.total = total;
          state.loading = false;
          state.error = null;
          
          console.log('Cart state after removal:', state);
          toast.success('Course removed from cart');
        } catch (error) {
          console.error('Error in removeFromCart.fulfilled:', error);
          state.loading = false;
          state.error = 'Failed to update cart after removal';
          toast.error('Failed to update cart');
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to remove course from cart';
        console.error('Remove from cart error:', action.error);
        toast.error(state.error);
      })
      
      // Fetch user cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        try {
          console.log('fetchUserCart.fulfilled - action.payload:', action.payload);
          
          // Handle different response structures
          let cartItems = [];
          
          // Case 1: Response has a cart array directly (most common case)
          if (Array.isArray(action.payload?.cart)) {
            cartItems = action.payload.cart;
          }
          // Case 2: Response has a data property with courses
          else if (action.payload?.data?.courses) {
            cartItems = Array.isArray(action.payload.data.courses) 
              ? action.payload.data.courses 
              : [];
          } 
          // Case 3: Response has a courses array directly
          else if (Array.isArray(action.payload?.courses)) {
            cartItems = action.payload.courses;
          }
          // Case 4: The payload is already an array of cart items
          else if (Array.isArray(action.payload)) {
            cartItems = action.payload;
          }
          // Case 5: Single item (should be an object with _id or courseId)
          else if (action.payload && (action.payload._id || action.payload.courseId)) {
            cartItems = [action.payload];
          }
          
          console.log('Fetched cart items:', cartItems);
          
          // Ensure all items have required fields with defaults
          const processedItems = cartItems.map(item => ({
            ...item,
            courseName: item.courseName || 'Untitled Course',
            instructorName: item.instructor?.name || item.instructorName || 'Instructor',
            thumbnail: item.thumbnail || item.image || 'https://via.placeholder.com/300x200',
            price: typeof item.price === 'number' ? item.price : 0,
            originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : null
          }));
          
          // Update the state with processed items
          state.cart = processedItems;
          state.items = processedItems; // Keep both for backward compatibility
          
          // Calculate and update totals
          const { totalItems, total } = calculateCartTotals(processedItems);
          state.totalItems = totalItems;
          state.total = total;
          state.loading = false;
          state.error = null;
          
          console.log('Cart state after fetch:', {
            cart: state.cart,
            totalItems: state.totalItems,
            total: state.total,
            loading: state.loading,
            error: state.error
          });
        } catch (error) {
          console.error('Error in fetchUserCart.fulfilled:', error);
          state.loading = false;
          state.error = 'Failed to process cart data';
        }
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
        console.error('Fetch cart error:', action.error);
      })
      
      // Clear cart
  },
});

// Selectors
export const selectCart = (state) => {
  try {
    // Get the entire cart state
    const cartState = state.cart || {};
    
    // Debug log the entire cart state structure
    console.log('selectCart - Raw cart state:', cartState);
    
    // Get cart items from the state
    // The items are stored in the cart property of the cart slice
    const cartItems = Array.isArray(cartState.cart) 
      ? cartState.cart 
      : [];
    
    // Ensure all items have required fields
    const processedItems = cartItems.map(item => ({
      ...item,
      courseName: item.courseName || 'Untitled Course',
      instructorName: item.instructorName || 'Instructor',
      thumbnail: item.thumbnail || 'https://via.placeholder.com/300x200',
      price: typeof item.price === 'number' ? item.price : 0,
      originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : null
    }));
    
    // Debug log
    console.log('selectCart - Processed items:', processedItems);
    
    return processedItems;
  } catch (error) {
    console.error('Error in selectCart:', error);
    return [];
  }
};

export const selectCartItemsCount = (state) => {
  const items = selectCart(state);
  return items.length;
};

export const selectCartTotal = (state) => {
  const items = selectCart(state);
  return items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price;
  }, 0);
};

export const selectCartLoading = (state) => state.cart.loading || false;
export const selectCartError = (state) => state.cart.error || null;

export const { resetCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

