import { apiConnector } from "../apiConnector";
import { cart } from "../apis";

/**
 * Fetches the user's cart from the server
 * @param {string} token - User's authentication token
 * @returns {Promise<Object>} - Cart data
 */
export const fetchCart = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      cart.GET_CART_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log('Fetched cart data:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Adds a course to the user's cart
 * @param {string} courseId - ID of the course to add
 * @param {string} token - User's authentication token
 * @returns {Promise<Object>} - Updated cart data
 */
export const addToCart = async (courseId, token) => {
  try {
    console.log('Adding to cart - courseId:', courseId);
    const response = await apiConnector(
      "POST",
      cart.ADD_TO_CART_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
    console.log('Add to cart response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**
 * Removes a course from the user's cart
 * @param {string} courseId - ID of the course to remove
 * @param {string} token - User's authentication token
 * @returns {Promise<Object>} - Updated cart data
 */
export const removeFromCart = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      cart.REMOVE_FROM_CART_API,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

/**
 * Clears the user's cart
 * @param {string} courseId - ID of the course to remove
 * @param {string} token - User's authentication token
 * @returns {Promise<Object>} - Empty cart data
 */
export const clearCart = async (courseId, token) => {
  try {
    console.log('Removing from cart - courseId:', courseId);
    const response = await apiConnector(
      "DELETE",
      `${cart.REMOVE_FROM_CART_API}/${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    );
    console.log('Remove from cart response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
